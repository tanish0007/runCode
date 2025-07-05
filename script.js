const rootContainer = document.querySelector("#root");

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.createElement("nav");
    nav.classList.add("nav");
    nav.innerHTML = `
        <h1>Playground</h1>
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
    const lineNumbers = document.createElement("div");
    lineNumbers.classList.add("line-numbers");  
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
          numbersHTML += i + '<br>';
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
        }
    })

    
    let langId = selectionBox.value;
    selectionBox.addEventListener("change", () => {
        langId = selectionBox.value;
    });

    compileBtn.addEventListener("click", compileAndRunCode);

    clearConsole.addEventListener("click", () => {
        output.value = "";
    });

    copyConsole.addEventListener("click", async () => {
        if (output.value.trim() === "") {
            alert("No output to copy!");
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
    });

    clearCode.addEventListener("click", () => {
        textarea.value = "";
    });

    copyCode.addEventListener("click", async () => {
        if (textarea.value.trim() === "") {
            alert("No output to copy!");
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

    function fetchResponse(codeId){
        let tries = 0;
        const MAXTry = 10;

        let interval = setInterval(() => {
            if (tries >= MAXTry) {
                clearInterval(interval);
                output.style.color = "orange";
                output.value = "TimeOut!! Try Again.."
                return;
            }
            tries++;

            let xhr = new XMLHttpRequest();
            let URL = `https://course.codequotient.com/api/codeResult/${codeId}`
            xhr.open("GET", URL, true);

            xhr.onload = function() {
                if (xhr.status === 200) {
                    let obj = JSON.parse(xhr.responseText);
                    console.log(obj);

                    if (obj.data) {
                        const res = JSON.parse(obj.data);

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
                            output.value = `No output recieved!!\n Please try again`;
                        }
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
                clearInterval(interval);
                output.style.color = "red";
                output.value = "Error fetching code result.";
            };

            xhr.send();
        }, 1000);
    }
})