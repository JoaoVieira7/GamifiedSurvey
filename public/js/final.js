document.addEventListener('DOMContentLoaded', function () {
    function gifAppears() {
        const gif = document.createElement('div');
        gif.classList.add('party');
      
        const gifImage = document.createElement('img');
        gifImage.src = '/images/best-gif.gif'; 
        gif.appendChild(gifImage);
      
        document.body.appendChild(gif);  
        setTimeout(() => { document.body.removeChild(gif) }, 4000);
        var audiofinal = new Audio('/audio/Finished.mp3');
        audiofinal.play();
    }
    window.onload = function() {
        gifAppears();
    };

})