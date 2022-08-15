
checkTheme();
function checkTheme() {
   
  let theme = localStorage.getItem('theme');
  if (theme == "dark") {
    document.getElementsByTagName("body")[0].className = "dark-mode";
    document.querySelector(".thead-toggle i").className = "fa fa-sun-o";
  } else {
    document.querySelector(".thead-toggle i").className = "fa fa-moon-o"
  }
}

 function reverseString(str) {
   return str.split("").reverse().join("");
 }

 function groupDigital(num) {
   const emptyStr = "";
   const group_regex = /\d{3}/g;

   // delete extra comma by regex replace.
   const trimComma = (str) => str.replace(/^[,]+|[,]+$/g, emptyStr);

   const str = num + emptyStr;
   const [integer, decimal] = str.split(".");

   const conversed = reverseString(integer);

   const grouped = trimComma(
     reverseString(conversed.replace(/\d{3}/g, (match) => `${match},`))
   );

   return !decimal ? grouped : `${grouped}.${decimal}`;
 }

 function gatPersianDate(date) {
   const option = {
     year: "numeric",
     month: "numeric",
     day: "numeric",
   };
   return date.toLocaleDateString("fa-IR", option);
 }

function toggleTheme() {
  
  isDarkMode = document.getElementsByTagName("body")[0].classList.toggle("dark-mode");
  if (isDarkMode) {
    localStorage.setItem("theme","dark");
    document.querySelector(".thead-toggle i").className = "fa fa-sun-o";
    window.location.reload();
  } else {
    document.querySelector(".thead-toggle i").className = "fa fa-moon-o";
    localStorage.setItem("theme","light");
    window.location.reload();
  }
}
