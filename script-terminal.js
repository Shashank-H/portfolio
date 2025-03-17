document.addEventListener('DOMContentLoaded', () => {
    // Terminal command history
    const commands = document.querySelectorAll('.command:not(:last-child)');
    const outputs = document.querySelectorAll('.output');
    
    // Initially hide all commands and outputs
    commands.forEach(cmd => cmd.style.opacity = '0');
    outputs.forEach(out => out.style.opacity = '0');

    // Function to show elements sequentially
    async function showSequentially() {
        for (let i = 0; i < commands.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait before showing command
            commands[i].style.opacity = '1';
            commands[i].classList.add('typing');
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before showing output
            if (outputs[i]) {
                outputs[i].style.opacity = '1';
            }
        }
    }

    // Start the sequence
    showSequentially();

    // Terminal input handling
    const terminalContent = document.querySelector('.terminal-content');
    const lastCommand = document.querySelector('.command:last-child');
    
    // Available commands
    const availableCommands = {
        'help': () => `Available commands:
    whoami - Display user information
    about - Show about information
    ls achievements - List achievements
    cat skills.json - Show skills
    contact --help - Show contact information
    clear - Clear terminal
    help - Show this help message`,
        'clear': () => {
            const commandHistory = document.querySelector('.command-history');
            commandHistory.innerHTML = '';
            return '';
        }
    };

    // Command input handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && lastCommand.textContent.trim() !== '') {
            const command = lastCommand.textContent.trim().toLowerCase();
            
            // Create new output element
            const output = document.createElement('div');
            output.className = 'output';
            
            // Handle command
            if (availableCommands[command]) {
                output.textContent = availableCommands[command]();
            } else {
                output.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
            }
            
            // Add output and new command prompt
            lastCommand.after(output);
            const newCommand = document.createElement('div');
            newCommand.className = 'command';
            newCommand.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> <span class="cursor">█</span>`;
            output.after(newCommand);
            
            // Scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    });

    // Terminal button functionality
    const closeButton = document.querySelector('.close');
    const minimizeButton = document.querySelector('.minimize');
    const maximizeButton = document.querySelector('.maximize');
    const terminal = document.querySelector('.terminal');

    closeButton.addEventListener('click', () => {
        terminal.style.animation = 'fadeOut 0.3s';
        setTimeout(() => terminal.style.display = 'none', 300);
    });

    let isMinimized = false;
    minimizeButton.addEventListener('click', () => {
        if (!isMinimized) {
            terminal.style.transform = 'scale(0.001)';
            terminal.style.opacity = '0';
        } else {
            terminal.style.transform = 'scale(1)';
            terminal.style.opacity = '1';
        }
        isMinimized = !isMinimized;
    });

    let isMaximized = false;
    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            terminal.style.width = '100%';
            terminal.style.height = '100vh';
            terminal.style.margin = '0';
            terminal.style.borderRadius = '0';
        } else {
            terminal.style.width = '90%';
            terminal.style.height = 'auto';
            terminal.style.margin = 'auto';
            terminal.style.borderRadius = '8px';
        }
        isMaximized = !isMaximized;
    });
});
