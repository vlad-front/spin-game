document.addEventListener('DOMContentLoaded', function() {
    const startPopup = document.querySelector('.js--start-popup');
    const endPopup = document.querySelector('.js--end-popup');
    const wrapper = document.querySelector('.js--wrapper');
    const activateButton = document.querySelector('.js--activate-game');
    const spinButton = document.querySelector('.js--spin');
    const spinsLeftElement = document.querySelector('.spins-left');
    const columns = document.querySelectorAll('.game__grid--col');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');

    let spinsLeft = 3;
    let currentSpin = 0;

    endPopup.classList.remove('active');

    columns.forEach(column => {
        const reel = document.createElement('div');
        reel.classList.add('reel');
        while (column.firstChild) {
            reel.appendChild(column.firstChild);
        }
        column.appendChild(reel);
    });

    const reels = document.querySelectorAll('.reel');

    activateButton.addEventListener('click', function() {
        startPopup.classList.remove('active');
    });

    spinButton.addEventListener('click', function() {
        if (spinsLeft > 0 && !spinButton.classList.contains('disabled')) {
            spinsLeft--;
            spinsLeftElement.textContent = spinsLeft;
            currentSpin++;
            spinButton.classList.add('disabled');

            reels.forEach((reel, index) => {
                let offset;
                if (currentSpin === 1) {
                    offset = -33.33;
                } else if (currentSpin === 2) {
                    offset = -66.66;
                } else if (currentSpin === 3) {
                    if (index === 0) offset = -199.98;
                    else if (index === 1) offset = -133.32;
                    else if (index === 2) offset = -233.31;
                }

                reel.classList.add('spinning');
                reel.style.transform = `translateY(${offset}rem)`;

                const images = reel.querySelectorAll('.game-image');
                const firstSix = Array.from(images).slice(0, 6);
                firstSix.forEach(img => {
                    const clone = img.cloneNode(true);
                    reel.appendChild(clone);
                });
            });

            setTimeout(() => {
                reels.forEach((reel, index) => {
                    reel.classList.remove('spinning');

                    const images = reel.querySelectorAll('.game-image');
                    if (images.length > 16) {
                        for (let i = 16; i < images.length; i++) {
                            images[i].remove();
                        }
                    }
                });

                if (currentSpin !== 3) {
                    spinButton.classList.remove('disabled');
                }

                if (currentSpin === 3) {
                    const winnerSlots = document.querySelectorAll('.js--winner-slot');
                    winnerSlots.forEach(slot => {
                        slot.classList.add('winner');
                    });

                    setTimeout(() => {
                        endPopup.classList.add('active');
                        spinButton.disabled = true;
                        spinButton.classList.add('disabled');
                        startTimer();
                    }, 3500);
                }
            }, 1500);
        }
    });

    function startTimer() {
        let timeLeft = 15 * 60;
        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
});