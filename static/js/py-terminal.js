/**
 * In-Browser Python Execution Engine based on Pyodide
 * Cleaned and optimized without redundant code.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Clean Responsive Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #py-trigger {
            position: fixed;
            bottom: 30px;
            left: 30px;
            background: rgba(10, 14, 39, 0.9);
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            padding: 10px 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #py-trigger:hover {
            background: var(--primary-color);
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.5);
        }

        #py-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 9998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        #py-backdrop.active {
            opacity: 1;
            pointer-events: auto;
        }

        #py-terminal-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 90%;
            max-width: 700px;
            background: rgba(10, 14, 39, 0.98);
            border: 1px solid var(--primary-color);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            border-radius: 12px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
            overflow: hidden;
        }
        #py-terminal-modal.active {
            opacity: 1;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        .py-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .py-title {
            color: #fff;
            font-family: monospace;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .py-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 1.2rem;
            transition: color 0.2s;
        }
        .py-close:hover { color: #fff; }

        .py-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        #py-input {
            width: 100%;
            height: 150px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #5af78e;
            font-family: 'Courier New', Courier, monospace;
            padding: 15px;
            border-radius: 6px;
            resize: none;
            outline: none;
        }
        #py-input:focus { border-color: var(--primary-color); }

        .py-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #py-status {
            color: var(--text-muted);
            font-family: monospace;
            font-size: 13px;
        }

        #py-run-btn {
            background: var(--gradient-primary);
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-family: monospace;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        #py-run-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        #py-run-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        #py-output {
            width: 100%;
            min-height: 120px;
            max-height: 250px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 6px;
            padding: 15px;
            color: #e0e0e0;
            font-family: 'Courier New', Courier, monospace;
            overflow-y: auto;
            white-space: pre-wrap;
            border-left: 3px solid var(--primary-color);
        }

        /* Mobile Styles - Trigger hidden on mobile in favor of Command Palette */
        @media (max-width: 768px) {
            #py-trigger {
                display: none !important;
            }
            #py-terminal-modal { 
                width: 95%; 
                max-width: 100%; 
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML UI
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="py-trigger" aria-label="Run Python"><i class="fab fa-python"></i> <span>Run Python</span></button>
        <div id="py-backdrop"></div>
        <div id="py-terminal-modal">
            <div class="py-header">
                <div class="py-title"><i class="fab fa-python"></i> Pyodide Execution Engine</div>
                <button class="py-close" id="py-close" aria-label="Close Terminal"><i class="fas fa-times"></i></button>
            </div>
            <div class="py-body">
                <div style="color: var(--text-secondary); font-size: 13px;">
                    Write real Python code below. It executes directly in your browser using WebAssembly.
                </div>
                <textarea id="py-input" spellcheck="false"># Welcome to my interactive portfolio!
import datetime

def welcome_guest():
    time_now = datetime.datetime.now().strftime("%H:%M")
    print(f"[{time_now}] Execution Engine Initialized.")
    print("\\nHello and Welcome!")
    print("I am Rounak Prasad, an aspiring Data Scientist from IIT Madras.")
    print("---------------------------------------------------------------")
    print("Feel free to write and execute any Python code right here.")
    print("You can even import packages like 'numpy' or 'pandas' directly!")
    
    return "Status: Ready to Innovate"

welcome_guest()</textarea>
                <div class="py-controls">
                    <span id="py-status">Status: Ready</span>
                    <button id="py-run-btn"><i class="fas fa-play"></i> Execute</button>
                </div>
                <div id="py-output">Terminal output...</div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Logic & Event Listeners
    const elems = {
        trigger: document.getElementById('py-trigger'),
        modal: document.getElementById('py-terminal-modal'),
        backdrop: document.getElementById('py-backdrop'),
        closeBtn: document.getElementById('py-close'),
        runBtn: document.getElementById('py-run-btn'),
        status: document.getElementById('py-status'),
        output: document.getElementById('py-output'),
        input: document.getElementById('py-input')
    };

    let pyodideInstance = null;
    let isExtracting = false;

    const toggleModal = (show) => {
        elems.modal.classList.toggle('active', show);
        elems.backdrop.classList.toggle('active', show);
    };

    window.openPythonTerminal = () => toggleModal(true);
    window.closePythonTerminal = () => toggleModal(false);

    elems.trigger.addEventListener('click', window.openPythonTerminal);
    elems.closeBtn.addEventListener('click', window.closePythonTerminal);
    elems.backdrop.addEventListener('click', window.closePythonTerminal);

    // Dynamic Engine Loader
    const initPyodide = async () => {
        elems.status.innerText = "Status: Downloading Pyodide...";
        elems.runBtn.disabled = true;
        
        try {
            if (typeof loadPyodide === 'undefined') {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            elems.status.innerText = "Status: Booting Language Environment...";
            pyodideInstance = await loadPyodide({
                stdout: (text) => { elems.output.innerText += text + '\n'; },
                stderr: (text) => { elems.output.innerText += text + '\n'; }
            });

            elems.status.innerText = "Status: Booted ⚡";
            elems.status.style.color = "var(--primary-color)";
        } catch (err) {
            elems.status.innerText = "Status: Failed to load Pyodide";
            elems.status.style.color = "red";
            console.error(err);
        } finally {
            elems.runBtn.disabled = false;
        }
    };

    // Execute Hook
    elems.runBtn.addEventListener('click', async () => {
        if (!pyodideInstance && !isExtracting) {
            isExtracting = true;
            await initPyodide();
            isExtracting = false;
        }

        if (pyodideInstance) {
            elems.output.innerText = "> Running script...\n";
            elems.status.innerText = "Status: Executing...";
            elems.runBtn.disabled = true;

            try {
                const code = elems.input.value;
                // Auto-download external libraries (numpy, pandas) safely
                await pyodideInstance.loadPackagesFromImports(code);
                
                const result = await pyodideInstance.runPythonAsync(code);
                
                if (result !== undefined) {
                    elems.output.innerText += "\n[Out]: " + result + "\n";
                }
                elems.status.innerText = "Status: Execution Successful ✅";
            } catch (err) {
                elems.output.innerText += "\n" + err.message;
                elems.status.innerText = "Status: Execution Error ❌";
            } finally {
                elems.runBtn.disabled = false;
            }
        }
    });
});
