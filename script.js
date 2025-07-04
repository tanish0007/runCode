const rootContainer = document.querySelector("#root");

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.createElement("nav");
    nav.classList.add("nav");
    nav.innerHTML = `
        <h1>Playground</h1>
    `;

    const inputSection = document.createElement("section");
    inputSection.classList.add("input-section");
    const actionBox = document.createElement("div");
    actionBox.classList.add("action-box");
    const selectionBox = document.createElement("select");
    selectionBox.setAttribute("name","language");
    selectionBox.setAttribute("id","language");
    selectionBox.innerHTML = `
        <option class="lang-option"> Select language </option>
        <option class="lang-option" value ="7"> C </option>
        <option class="lang-option" value ="77" selected> C++ </option>
        <option class="lang-option" value ="8"> Java </option>
        <option class="lang-option" value ="0"> Python </option>
        <option class="lang-option" value ="4"> Javascript </option>
    `;
    const compileBtn = document.createElement("button");
    compileBtn.innerHTML = `<i class="fa-solid fa-play"></i>&nbsp;Execute`;
    const codeEditor = document.createElement("div");
    codeEditor.classList.add("code-editor");
    const lineNumbers = document.createElement("div");
    lineNumbers.classList.add("line-numbers");  
    const textarea = document.createElement("textarea");
    textarea.classList.add("editor");

    const outputSection = document.createElement('section');
    outputSection.classList.add("output-section");
    const output = document.createElement("textarea");
    output.classList.add("output");
    output.readOnly = true;

    actionBox.appendChild(selectionBox);
    actionBox.appendChild(compileBtn);

    codeEditor.appendChild(lineNumbers);
    codeEditor.appendChild(textarea);

    inputSection.appendChild(actionBox);
    inputSection.appendChild(codeEditor);

    outputSection.appendChild(output);

    rootContainer.appendChild(nav);
    rootContainer.appendChild(inputSection);
    rootContainer.appendChild(outputSection);

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
                            output.value = res.output.substring(9);
                        }
                    }
                } else {
                    console.error("Error fetching code result:", xhr.status);
                    clearInterval(interval);
                    output.value = "Error fetching code result.";
                }
            };

            xhr.onerror = function() {
                console.error("Network error while fetching code result.");
                clearInterval(interval);
                output.value = "Error fetching code result.";
            };

            xhr.send();
        }, 1000);
    }
})

