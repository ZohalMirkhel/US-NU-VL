document.addEventListener('DOMContentLoaded', function () {
    const phoneForm = document.getElementById('phone-form');
    const select = document.getElementById('dropdown');
    const selected = select.querySelector('.selected');
    const optionsContainer = select.querySelector('.options-container');
    const options = select.querySelectorAll('.option');
    const phoneNumberInput = document.getElementById('user-input');
    const checkButton = document.getElementById('check-btn');
    const clearButton = document.getElementById('clear-btn');
    const resultsDiv = document.getElementById('results-div');

    optionsContainer.style.display = 'none';

    selected.addEventListener('click', () => {
        optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerHTML = option.innerHTML;
            selected.setAttribute('data-value', option.getAttribute('data-value'));
            optionsContainer.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!select.contains(e.target)) {
            optionsContainer.style.display = 'none';
        }
    });

    if (!phoneForm || !select || !phoneNumberInput || !checkButton || !clearButton || !resultsDiv) {
        console.error('Required elements not found.');
        return;
    }

    phoneForm.addEventListener('submit', function (event) {
        event.preventDefault();
        checkValidNumber(phoneNumberInput.value);
    });

    checkButton.addEventListener('click', function () {
        checkValidNumber(phoneNumberInput.value);
    });

    phoneNumberInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            checkValidNumber(phoneNumberInput.value);
        }
    });

    clearButton.addEventListener('click', function (event) {
        event.preventDefault();
        phoneNumberInput.value = '';
        selected.innerHTML = 'Select Country';
        resultsDiv.textContent = '';
    });

    const checkValidNumber = input => {
        resultsDiv.textContent = '';
        const phoneNumber = input.trim();
        const countryCode = selected.getAttribute('data-value');

        if (!phoneNumber) {
            alert('Please provide a phone number');
            return;
        }

        if (!countryCode) {
            resultsDiv.textContent = 'Please select a country.';
            return;
        }

        if (countryCode.toUpperCase() === 'US') {
            validateUSPhoneNumber(phoneNumber);
        } else {
            validateInternationalPhoneNumber(phoneNumber, countryCode.toUpperCase());
        }
    };

    const validateUSPhoneNumber = input => {
        const countryCode = '^(1\\s?)?';
        const areaCode = '(\\([0-9]{3}\\)|[0-9]{3})';
        const spacesDashes = '[\\s\\-]?';
        const phoneNumber = '[0-9]{3}[\\s\\-]?[0-9]{4}$';
        const phoneRegex = new RegExp(
            `${countryCode}${areaCode}${spacesDashes}${phoneNumber}`
        );

        const pTag = document.createElement('p');
        pTag.className = 'results-text';
        const isValid = phoneRegex.test(input);
        pTag.style.color = isValid ? '#00471b' : '#4d3800';
        pTag.appendChild(
            document.createTextNode(
                `${isValid ? 'Valid' : 'Invalid'} US number: ${input}`
            )
        );
        resultsDiv.appendChild(pTag);
    };

    const validateInternationalPhoneNumber = (phoneNumber, countryCode) => {
        const pTag = document.createElement('p');
        pTag.className = 'results-text';
        let isValid = false;
        let formattedNumber = phoneNumber;

        try {
            const phoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();
            const parsedNumber = phoneNumberUtil.parse(phoneNumber, countryCode);
            isValid = phoneNumberUtil.isValidNumber(parsedNumber);
            formattedNumber = phoneNumberUtil.format(parsedNumber, libphonenumber.PhoneNumberFormat.INTERNATIONAL);
        } catch (error) {
            console.error('Error validating phone number:', error);
            isValid = false;
        }

        pTag.style.color = isValid ? '#00471b' : '#4d3800';
        pTag.appendChild(
            document.createTextNode(
                `${isValid ? 'Valid' : 'Invalid'} ${countryCode} number: ${formattedNumber}`
            )
        );
        resultsDiv.appendChild(pTag);
    };
});
