//git add .
//git commit -m "Updated files"
//git push origin main

// jahan jahan kaam karna hai usko pahle le aao yahan/to keep in mind-- wrong tarika 
const inputSlider = document.querySelector("[data-lengthSlider]"); //To fetch custom attribute --> "[custom-attribute]"
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_+[]{}|;:,.<>?/~`-=\\";

let password = ''; //Initially
let passwordLength = 10; // Initially set to 10
let checkCount = 0; // 1 tickbox me tick lga rhega

// Set initial slider value
handleSlider();

// Function to handle slider value update
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; // Display initial length correctly
    const min = inputSlider.min;// thumb move krne se left side aur right side ka colour alag hone ke liye 
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow ='0px 0px 12px 1px ${color}';
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    const randNumber = getRndInteger(0, symbols.length);
    return symbols.charAt(randNumber);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// to copy generated password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//shuffle code-->
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//jab v change hoga tick/untick, ye function suru se check krega kitna box checked h
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

//slider slide krne pr kya hoga
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) // password length > 0 also
        copyContent();
});

generateBtn.addEventListener("click", () => {
    //if none of the checkbox are selected
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start journey to find new password
    console.log("Starting Journey");
    //remove old password
    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbols);

    //compulsory addition
    // funcArr.forEach(func => password += func()); OR
    for(let i = 0; i < funcArr.length;i++){
        password += funcArr[i]();
    }
    // console.log("Compulsory Addition Done");
    
    //remaining addition 
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        // console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");
    
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");
    
    //show in UI
    passwordDisplay.value = password;
    
    //calculate strength
    calcStrength();
});
