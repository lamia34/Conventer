const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';
let inputType = 'left'
const rateInfoLeft = document.querySelector('.rate-info-left');
const rateInfoRight = document.querySelector('.rate-info-right');

const fetchExchangeRate = async (baseCurrency, targetCurrency) => {
    try {
        const response = await fetch(`${apiUrl}${baseCurrency}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.rates[targetCurrency];
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// Formatlama funksiyası
function formatNumber(value) {
    value = value.replace(/,/g,'.')
    const pattern = /^[0-9]*\.?[0-9]*$/
    if(!pattern.test(value)){
        return value.slice(0, -1)
    }

    return value;
}



const updateConverter = async () => {
    const leftInput = document.querySelector('.left .mebleg');
    const rightInput = document.querySelector('.right .result');
    const baseCurrency = document.querySelector('.left .btn.active')?.value;
    const targetCurrency = document.querySelector('.right .btn.active')?.value;

    if (baseCurrency && targetCurrency) {
        const rate = await fetchExchangeRate(baseCurrency, targetCurrency);

        if (rateInfoLeft && rateInfoRight) {
            rateInfoLeft.textContent = `1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
            rateInfoRight.textContent = `1 ${targetCurrency} = ${(1 / rate).toFixed(4)} ${baseCurrency}`;
        }

        if (inputType === 'left') {
            const leftValue = leftInput.value;
            rightInput.value = leftValue ? formatNumber((leftValue * rate).toFixed(4)) : '';
        } else if (inputType === 'right') {
            const rightValue = rightInput.value;
            leftInput.value = rightValue ? formatNumber((rightValue / rate).toFixed(4)) : '';
        }
    }
};


const handleButtonClick = (buttonGroup, callback) => {
    buttonGroup.forEach(button => {
        button.addEventListener('click', () => {
            buttonGroup.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            callback();
        });
    });
};


const leftButtons = document.querySelectorAll('.left .btn');
const rightButtons = document.querySelectorAll('.right .btn');
const leftInput = document.querySelector('.left .mebleg');
const rightInput = document.querySelector('.right .result');

handleButtonClick(leftButtons, () => updateConverter());
handleButtonClick(rightButtons, () => updateConverter());


leftInput.addEventListener('input', (e) => {
    leftInput.value = formatNumber(e.target.value)
    updateConverter()
    inputType = 'left'
});
rightInput.addEventListener('input', (e) => {
    rightInput.value = formatNumber(e.target.value)
    updateConverter()
    inputType = 'right'
});


updateConverter(); 