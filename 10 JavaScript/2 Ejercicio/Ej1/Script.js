let bton = document.getElementById("toggleBtn");
let box = document.getElementById("box");

bton.addEventListener("click", function()
{
    box.style.display = 'none';
});

bton.addEventListener("dblclick", function()
{
    box.style.display = 'block';
});