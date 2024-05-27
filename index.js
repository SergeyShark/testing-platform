const idInstanceInput = document.querySelector("#id-instance");
const apiTokenInput = document.querySelector("#api-token");
const getSettingsButton = document.querySelector("#get-settings");
const getStateButton = document.querySelector("#get-state");
const messageChatIdInput = document.querySelector("#chat-id-message");
const messageTextArea = document.querySelector("#message");
const sendMessageButton = document.querySelector("#send-message");
const fileChatIdInput = document.querySelector("#chat-id-file");
const fileUrlInput = document.querySelector("#file-url");
const sendFileButton = document.querySelector("#send-file");
const responseTextArea = document.querySelector("#response");
const messageSelector = document.querySelector("#option-for-messages");
const fileSelector = document.querySelector("#option-for-files");
getSettingsButton.addEventListener("click", (e) => {
  e.preventDefault();
  getSettings();
});
getStateButton.addEventListener("click", (e) => {
  e.preventDefault();
  getStateInstance();
});
sendMessageButton.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});
sendFileButton.addEventListener("click", (e) => {
  e.preventDefault();
  sendFileByUrl();
});
function clearResponse() {
  responseTextArea.value = "";
}
function getInstanseData() {
  return {
    idInstance: idInstanceInput.value.trim(),
    apiTokenInstance: apiTokenInput.value.trim(),
  };
}
async function handleApiRequst(urlMethod, requestMethod, data = {}) {
  const instanceData = getInstanseData();
  if (instanceData.apiTokenInstance && instanceData.idInstance) {
    try {
      const url = `https://api.green-api.com/waInstance${instanceData.idInstance}/${urlMethod}/${instanceData.apiTokenInstance}`;
      const response = await fetch(url, {
        method: requestMethod,
        body: requestMethod === "POST" ? JSON.stringify(data) : undefined,
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: статус ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error.message);
      return { error: error.message };
    }
  } else {
    throw new Error(`поля idInstance и apiTokenInstance должны быть заполнены`);
  }
}
async function getSettings() {
  clearResponse();
  try {
    const data = await handleApiRequst("getSettings", "GET");
    responseTextArea.value = JSON.stringify(data, null, 4);
    console.log(data);
  } catch (error) {
    responseTextArea.value = error.message;
  }
}
async function getStateInstance() {
  clearResponse();
  try {
    const data = await handleApiRequst("getStateInstance", "GET");
    console.log(data);
    responseTextArea.value = JSON.stringify(data, null, 4);
  } catch (error) {
    responseTextArea.value = error.message;
  }
}
async function sendMessage() {
  clearResponse();
  try {
    const messageData = {
      chatId: messageChatIdInput.value + messageSelector.value,
      message: messageTextArea.value,
    };
    if (!messageData.chatId || !messageData.message) {
      throw new Error(`поля chatId и message должны быть заполнены`);
    }
    const data = await handleApiRequst("sendMessage", "POST", messageData);
    responseTextArea.value = JSON.stringify(data, null, 4);
  } catch (error) {
    responseTextArea.value = error.message;
  }
}
async function sendFileByUrl() {
  clearResponse();
  try {
    const fileData = {
      chatId: fileChatIdInput.value + fileSelector.value,
      urlFile: fileUrlInput.value,
      fileName: fileUrlInput.value.substring(
        fileUrlInput.value.lastIndexOf("/") + 1
      ),
    };
    if (!fileData.chatId || !fileData.urlFile || !fileData.fileName) {
      throw new Error(`поля chatId и urlFile должны быть заполнены`);
    }
    const data = await handleApiRequst("sendFileByUrl", "POST", fileData);
    responseTextArea.value = JSON.stringify(data, null, 4);
  } catch (error) {
    responseTextArea.value = error.message;
  }
}
