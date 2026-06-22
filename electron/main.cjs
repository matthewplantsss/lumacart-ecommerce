const {
  app,
  BrowserWindow,
  dialog,
  shell,
} = require("electron");

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const isDevelopment = !app.isPackaged;

let mainWindow = null;
let backendProcess = null;
let isQuitting = false;

function getBackendEntry() {
  if (isDevelopment) {
    return path.join(
      app.getAppPath(),
      "backend",
      "server.cjs"
    );
  }

  return path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    "backend",
    "server.cjs"
  );
}

function startBackend() {
  if (isDevelopment) {
    return;
  }

  const backendEntry = getBackendEntry();
  const databaseDirectory = app.getPath("userData");

  console.log("Packaged:", app.isPackaged);
  console.log("App path:", app.getAppPath());
  console.log("Resources path:", process.resourcesPath);
  console.log("Backend entry:", backendEntry);
  console.log("Database directory:", databaseDirectory);

  backendProcess = spawn(
    process.execPath,
    [backendEntry],
    {
      cwd: path.dirname(backendEntry),
      env: {
        ...process.env,
        PORT: "5050",
        LUMACART_DATA_DIR: databaseDirectory,
        ELECTRON_RUN_AS_NODE: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  backendProcess.stdout?.on("data", (data) => {
    console.log(`[LumaCart backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error(`[LumaCart backend] ${data.toString().trim()}`);
  });

  backendProcess.on("error", (error) => {
    console.error("Unable to start the LumaCart backend:", error);
  });

  backendProcess.on("exit", (code, signal) => {
    console.log(
      `LumaCart backend exited with code ${code} and signal ${signal}`
    );

    backendProcess = null;

    if (!isQuitting && mainWindow) {
      dialog.showErrorBox(
        "LumaCart Backend Stopped",
        "The local LumaCart service stopped unexpectedly. Please restart the application."
      );
    }
  });
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }

  backendProcess = null;
}

function waitForBackend(
  url = "http://127.0.0.1:5050/api/health",
  attemptsRemaining = 50
) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();

      if (response.statusCode === 200) {
        resolve();
        return;
      }

      retry();
    });

    request.on("error", retry);

    request.setTimeout(1000, () => {
      request.destroy();
      retry();
    });

    function retry() {
      if (attemptsRemaining <= 0) {
        reject(
          new Error("The LumaCart backend did not start.")
        );
        return;
      }

      setTimeout(() => {
        waitForBackend(url, attemptsRemaining - 1)
          .then(resolve)
          .catch(reject);
      }, 200);
    }
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1050,
    minHeight: 700,
    title: "LumaCart",
    backgroundColor: "#f6f7f3",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDevelopment) {
    await mainWindow.loadURL(
      "http://127.0.0.1:5173"
    );
  } else {
    await waitForBackend();

    await mainWindow.loadFile(
      path.join(app.getAppPath(), "dist", "index.html")
    );
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (
      isDevelopment &&
      process.env.LUMACART_OPEN_DEVTOOLS === "true"
    ) {
      mainWindow.webContents.openDevTools({
        mode: "detach",
      });
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      shell.openExternal(url);
    }

    return {
      action: "deny",
    };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    startBackend();
    await createWindow();
  } catch (error) {
    console.error(error);

    dialog.showErrorBox(
      "Unable to Start LumaCart",
      error.message
    );

    app.quit();
  }

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      try {
        await createWindow();
      } catch (error) {
        dialog.showErrorBox(
          "Unable to Open LumaCart",
          error.message
        );
      }
    }
  });
});

app.on("before-quit", () => {
  isQuitting = true;
  stopBackend();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
