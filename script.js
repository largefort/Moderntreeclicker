let woodCount = 0;
let lumberjacks = 0;

const tutorialSteps = ["Welcome to Modern Tree Clicker Empire! Click the tree to collect wood.", "Great job! You've collected your first wood. Keep clicking to gather more.", "You can spend your wood on upgrades to increase your collection rate.", "Now, you can also hire lumberjacks to automatically collect wood for you. Click 'Hire Lumberjack' to get started."];
let currentStep = 0;

function showTutorialStep() {
    if (currentStep < tutorialSteps.length) {
        const tutorialBox = document.getElementById("tutorial-box");
        tutorialBox.textContent = tutorialSteps[currentStep];
        currentStep++;
    } else {
        document.getElementById("tutorial-box").style.display = "none";
    }
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

const request = window.indexedDB.open('treeClickerDB', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('gameData')) {
        db.createObjectStore('gameData', { keyPath: 'id' });
    }
};

request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
};

request.onsuccess = (event) => {
    const db = event.target.result;

    function saveGameData() {
        const transaction = db.transaction(['gameData'], 'readwrite');
        const store = transaction.objectStore('gameData');

        const gameData = {
            id: 1,
            woodCount,
            lumberjacks,
        };

        const request = store.put(gameData);

        request.onsuccess = () => {
            console.log('Game data saved successfully!');
        };

        transaction.oncomplete = () => {
        };

        transaction.onerror = (event) => {
            console.error('Error saving game data:', event.target.error);
        };
    }

    function loadGameData() {
        const transaction = db.transaction(['gameData'], 'readonly');
        const store = transaction.objectStore('gameData');

        const request = store.get(1);

        request.onsuccess = (event) => {
            const savedGameData = event.target.result;
            if (savedGameData) {
                woodCount = savedGameData.woodCount;
                lumberjacks = savedGameData.lumberjacks;
                updateUI();
            }
        };

        request.onerror = (event) => {
            console.error('Error loading game data:', event.target.error);
        };
    }

    loadGameData();

    function updateGameData() {
        saveGameData();
    }

    document.getElementById("tree-image").addEventListener("click", () => {
        woodCount++;
        updateGameData();
        showTutorialStep();
        showNotification("You've collected wood!");
    });

    document.getElementById("click-button").addEventListener("click", () => {
        document.getElementById("tree-image").click();
    });

    document.getElementById("hire-button").addEventListener("click", () => {
        const lumberjackCost = 10;
        if (woodCount >= lumberjackCost) {
            woodCount -= lumberjackCost;
            lumberjacks++;
            updateGameData();
            showNotification("You've hired a lumberjack!");
            autoWoodCollection();
        } else {
            showNotification("Not enough wood to hire a lumberjack!");
        }
    });

    function autoWoodCollection() {
        setInterval(() => {
            woodCount += lumberjacks * 2;
            updateUI();
        }, 2000);
    }

    function updateUI() {
        document.getElementById("wood-count").textContent = woodCount;
        document.getElementById("lumberjack-count").textContent = lumberjacks;
    }

    updateUI();
};
