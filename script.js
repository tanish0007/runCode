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
    const codeEditor = document.createElement("div");
    codeEditor.classList.add("code-editor");
    const lineNumbers = document.createElement("div");
    lineNumbers.classList.add("line-numbers");  
    const textarea = document.createElement("textarea");
    textarea.classList.add("editor");
    textarea.placeholder = "Write your code here.."
    

    const outputSection = document.createElement('div');
    outputSection.classList.add("output-section");
    const outputActions = document.createElement("div");
    outputActions.classList.add("output-actions");
    const compileBtn = document.createElement("button");
    compileBtn.id = "compileBtn";
    compileBtn.innerHTML = `<i class="fa-solid fa-play"></i>&nbsp;&nbsp;Execute`;
    const outputContainer = document.createElement("div");
    outputContainer.classList.add("output-box");
    const output = document.createElement("textarea");
    output.classList.add("output");
    output.readOnly = true;
    
    outputActions.appendChild(compileBtn);
    outputContainer.appendChild(output);

    codeEditor.appendChild(lineNumbers);
    codeEditor.appendChild(textarea);

    inputSection.appendChild(selectionBox);
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


    let langId = selectionBox.value;
    

    selectionBox.addEventListener("change", () => {
        langId = selectionBox.value;
    });

    compileBtn.addEventListener("click", ()=> {
        let data = {
            code : textarea.value,
            langId : langId
        }
        console.log(data);

        if(textarea.value.trim() === "")
            alert("Please enter valid code");
        else {
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
                    output.textContent = "Error executing code.";
                }
            }

            xhttp.onerror = () => {
                console.error("Network error while executing the code");
                output.style.color = "red";
                output.value = "Error Executing Code";
            }
            xhttp.send(JSON.stringify(data));
        }
    })

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

                    if (obj.data) {
                        const res = JSON.parse(obj.data);
                        if (res.hasOwnProperty("output")) {
                            clearInterval(interval);
                            output.style.color = "#03ff35";
                            output.value = res.output.substring(9);
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

