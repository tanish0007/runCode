const rootContainer = document.querySelector("#root");

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.createElement("nav");
    nav.classList.add("nav");
    nav.innerHTML = `
        <h2>Code&nbsp;&nbsp;Playground</h2>
        <p>{&nbsp;Made with <i class="fa-solid fa-heart" style="color:#dc143c"></i> by <span>Tanish Jangra</span>&nbsp;}</p>
        <span><a href="github.com/tanish0007/runCode"><i class="fa-brands fa-github"></i>&nbsp;Github</a></span>
    `;

    const mainSection = document.createElement("section");
    mainSection.classList.add("main-section");

    const inputSection = document.createElement("div");
    inputSection.classList.add("input-section");

    const inputActions = document.createElement("div");
    inputActions.classList.add("input-actions");
    const selectionBox = document.createElement("select");
    selectionBox.classList.add("selection-box");
    selectionBox.setAttribute("name","language");
    selectionBox.setAttribute("id","language");
    selectionBox.innerHTML = `
        <option class="lang-option" value ="7"> C </option>
        <option class="lang-option" value ="77" selected> C++ </option>
        <option class="lang-option" value ="8"> Java </option>
        <option class="lang-option" value ="0"> Python </option>
        <option class="lang-option" value ="4"> Javascript </option>
    `;
    const inCpClEvents = document.createElement("div");
    inCpClEvents.classList.add("in-evt-box");
    const clearCode = document.createElement("button");
    clearCode.id = "clearCode";
    clearCode.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Clear`;
    const copyCode = document.createElement("button");
    copyCode.id = "copyCode";
    copyCode.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Code`;
    inCpClEvents.appendChild(clearCode);
    inCpClEvents.appendChild(copyCode);


    const codeEditor = document.createElement("div");
    codeEditor.classList.add("code-editor");
    const lineNumbers = document.createElement("textarea");
    lineNumbers.classList.add("line-numbers");
    lineNumbers.readOnly = true;
    lineNumbers.setAttribute("aria-label", "Line numbers");
    const textarea = document.createElement("textarea");
    textarea.classList.add("editor");
    textarea.placeholder = "Write your code here..";
    textarea.spellcheck = false;
    

    const outputSection = document.createElement('div');
    outputSection.classList.add("output-section");
    const outputActions = document.createElement("div");
    outputActions.classList.add("output-actions");
    const compileBtn = document.createElement("button");
    compileBtn.id = "compileBtn";
    compileBtn.title = "[Ctrl+Enter]"
    compileBtn.innerHTML = `<i class="fa-solid fa-play"></i>&nbsp;&nbsp;Execute`;

    const outCpClEvents = document.createElement("div");
    outCpClEvents.classList.add("out-evt-box")
    const clearConsole = document.createElement("button");
    clearConsole.id = "clearConsole";
    clearConsole.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Clear`;
    const copyConsole = document.createElement("button");
    copyConsole.id = "copyConsole";
    copyConsole.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Console`;

    const outputContainer = document.createElement("div");
    outputContainer.classList.add("output-box");
    const output = document.createElement("textarea");
    output.classList.add("output");
    output.placeholder = "Press [Ctrl+Enter] to execute.."
    output.readOnly = true;

    outCpClEvents.appendChild(clearConsole);
    outCpClEvents.appendChild(copyConsole);

    outputActions.appendChild(compileBtn);
    outputActions.appendChild(outCpClEvents);

    outputContainer.appendChild(output);

    inputActions.appendChild(selectionBox);
    inputActions.appendChild(inCpClEvents);

    codeEditor.appendChild(lineNumbers);
    codeEditor.appendChild(textarea);

    inputSection.appendChild(inputActions);
    inputSection.appendChild(codeEditor);

    outputSection.appendChild(outputActions);
    outputSection.appendChild(outputContainer);

    mainSection.appendChild(inputSection);
    mainSection.appendChild(outputSection);

    rootContainer.appendChild(nav);
    rootContainer.appendChild(mainSection);
    

    function updateLineNumbers() {
        const lines = textarea.value.split('\n');
        const lineCount = lines.length;

        let numbersHTML = '';
        const shouldShowExtraLine = lineCount === 0 || lines[lineCount - 1] !== '';

        const totalLines = shouldShowExtraLine ? lineCount + 1 : lineCount;

        for (let i = 1; i <= totalLines; i++) {
          numbersHTML += i + '\n';
        }

        lineNumbers.innerHTML = numbersHTML;
        syncScroll();
    }

    function syncScroll() {
        lineNumbers.scrollTop = textarea.scrollTop;
    }

    textarea.addEventListener('input', updateLineNumbers);
    textarea.addEventListener('scroll', syncScroll);
    updateLineNumbers();

    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            updateLineNumbers();
        } 
    });

    document.addEventListener('keydown', (evt) => {
        if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
            evt.preventDefault();
            compileAndRunCode();
            showToast('Compiling...','Yellow','black');
        }
        else if ((evt.ctrlKey || evt.metaKey) && evt.altKey && evt.key === 'x') {
            evt.preventDefault();
            textarea.value = "";
            updateLineNumbers(); 
            showToast('Editor Cleared!', 'red', 'white');
        }
    })

    function showToast(message, bgColor, color) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = bgColor;
        toast.style.color = color;
        toast.style.fontWeight = 700;
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1000';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 1500);
    }

    
    let langId = selectionBox.value;
    selectionBox.addEventListener("change", () => {
        langId = selectionBox.value;
    });

    compileBtn.addEventListener("click", compileAndRunCode);

    clearConsole.addEventListener("click", () => {
        output.value = "";
        showToast('Console Cleared!', 'red', 'white');
    });

    copyConsole.addEventListener("click", async () => {
        if (output.value.trim() === "") {
            showToast('No Output to copy', 'red', 'white');
            return;
        }

        try {
            await navigator.clipboard.writeText(output.value);
            const originalText = copyConsole.innerHTML;
            copyConsole.style.color = "#03ff35";
            copyConsole.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;

            setTimeout(() => {
                copyConsole.style.color = "rgb(176, 176, 176)";
                copyConsole.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            alert("Failed to copy: " + err);
        }
        showToast('Console Copied!', 'green', 'white');
    });

    clearCode.addEventListener("click", () => {
        textarea.value = "";
        updateLineNumbers();
        showToast('Editor Cleared!', 'red', 'white');
    });

    copyCode.addEventListener("click", async () => {
        if (textarea.value.trim() === "") {
            showToast('No Code to copy', 'red', 'white');
            return;
        }

        try {
            await navigator.clipboard.writeText(textarea.value);
            const originalText = copyCode.innerHTML;
            copyCode.style.color = "black";
            copyCode.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;

            setTimeout(() => {
                copyCode.style.color = "#dc143c";
                copyCode.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            alert("Failed to copy: " + err);
        }
        showToast('Code Copied!!', 'green', 'white');
    });

    function compileAndRunCode() {
        let data = {
            code: textarea.value,
            langId: langId
        };
        console.log(data);

        if (textarea.value.trim() === "") {
            alert("Please enter valid code");
        } else {
            output.style.color = "yellow";
            showToast('Compiling...','Yellow','black');
            output.value = "Compiling...";

            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://course.codequotient.com/api/executeCode", true);
            xhttp.setRequestHeader("Content-Type", "application/json");

            xhttp.onload = () => {
                if (xhttp.status === 200) {
                    let obj = JSON.parse(xhttp.responseText);
                    console.log(obj);
                    let codeId = obj.codeId;
                    fetchResponse(codeId);
                } else {
                    console.error("Error executing code:", xhttp.status);
                    output.style.color = "red";
                    output.textContent = "Error executing code.";
                }
            };

            xhttp.onerror = () => {
                console.error("Network error while executing the code");
                output.style.color = "red";
                output.value = "Error Executing Code";
            };
            xhttp.send(JSON.stringify(data));
        }
    }

    function fetchResponse(codeId) {
        let tries = 0;
        const MAX_TRIES = 10;
        const MIN_WAIT_TIME = 5000;
        let startTime = Date.now();

        let interval = setInterval(() => {
            tries++;

            let xhr = new XMLHttpRequest();
            let URL = `https://course.codequotient.com/api/codeResult/${codeId}`;
            xhr.open("GET", URL, true);

            xhr.onload = function() {
                if (xhr.status === 200) {
                    let obj = JSON.parse(xhr.responseText);

                    if (obj.data) {
                        const res = JSON.parse(obj.data);
                        console.log(res);
                        if (res.status === "Pending") {
                            console.log("Staus is pending");
                            if (Date.now() - startTime < MIN_WAIT_TIME) {
                                return;
                            }
                            if (tries < MAX_TRIES) {
                                return;
                            }
                        }
                        if (res.errors) {
                            clearInterval(interval);
                            output.style.color = "red";
                            output.value = res.errors;
                        } 
                        else if (res.output) {
                            clearInterval(interval);
                            output.style.color = "#03ff35";
                            output.value = res.output.substring(9); 
                        }
                        else {
                            clearInterval(interval);
                            output.style.color = "orange";
                            output.value = `No output received after ${MAX_TRIES} tries!\nPlease try again.`;
                        }
                    } else {
                        clearInterval(interval);
                        output.style.color = "orange";
                        output.value = `No data received after ${MAX_TRIES} tries!\nPlease try again.`;
                    }
                } else {
                    console.error("Error fetching code result:", xhr.status);
                    clearInterval(interval);
                    output.style.color = "red";
                    output.value = "Error fetching code result.";
                }
            };

            xhr.onerror = function() {
                console.error("Network error while fetching code result.");
                if (tries >= MAX_TRIES) {
                    clearInterval(interval);
                    output.style.color = "red";
                    output.value = "Network error while fetching code result.";
                }
            };

            xhr.send();

            if (tries >= MAX_TRIES) {
                clearInterval(interval);
                if (output.value === "Compiling...") {
                    output.style.color = "orange";
                    output.value = `Timeout after ${MAX_TRIES} seconds!\nPlease try again.`;
                }
            }
        }, 1000);
    }

    const languageTemplates = {
        "7" : `#include <stdio.h>

int main() {
    printf("Hello from Tanish!!\\n");
    return 0;
}`,
        "77" : `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from Tanish!!" << endl;
    return 0;
}`,
        "8": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Tanish!!");
    }
}`,
        "0": `print("Hello from Tanish!!")`,
        "4": `console.log("Hello from Tanish!!");`
    };

    function updateEditorLanguage() {
        langId = selectionBox.value;
        textarea.id = `editor-${langId}`;
        const helpMessage = 
            "You can run the program by pressing [Ctrl+Enter]\n" +
            "Or clicking the Execute Button\n" +
            "Clear the editor by [Ctrl+Alt+x]";


        if (langId !== "0") {
            textarea.value = `/*\n${helpMessage}\n*/\n\n${languageTemplates[langId]}`;
        } else {
            textarea.value = `\"\"\"\n${helpMessage}\n\"\"\"\n\n${languageTemplates[langId]}`;
        }
        updateLineNumbers();
    }

    selectionBox.addEventListener("change", updateEditorLanguage);
    updateEditorLanguage();
})