class Markup {


    constructor( vuforiaScope, imgsrc, markupWidth = 10, markupColor = "FF0D0D") {

        // let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

        // if (orientation === "landscape-primary") {
        // console.log("That looks good.");
        // } else if (orientation === "landscape-secondary") {
        // console.log("Mmmh... the screen is upside down!");
        // } else if (orientation === "portrait-secondary" || orientation === "portrait-primary") {
        // console.log("Mmmh... you should rotate your device to landscape");
        // } else if (orientation === undefined) {
        // console.log("The orientation API isn't supported in this browser :(");
        // }


var canvasWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var canvasHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;

console.log("canvasWidth=" + canvasWidth + " canvasHeight=" + canvasHeight);

        let markupCanvas = new MarkupCanvas(vuforiaScope,canvasWidth,canvasHeight);
        let markupUI = new MarkupUI(markupCanvas, canvasWidth,canvasHeight ,imgsrc);
        markupCanvas.setupLens( imgsrc, markupUI.buildMarkUpUI());
    }



}


class MarkupCanvas {

    #LENS_ALREADY_DEFINED = false;
    #IS_PAINTING = false;
    #lensCanvas;
    #imgElement;
    #mainElement;
    #canvasWidth;
    #canvasHeight;
    #markupWidth;
    #markupColor;
    #markupType;
    #vuforiaScope;
    #backgroundLensimgsrc;
    #startX;
    #startY;
    #savedCanvas;
    #offset;
 
    constructor( vuforiaScope, canvasWidth , canvasHeight,   markupWidth = 10, markupColor = "#fbc93d") {


        this.matchMedia  = window.matchMedia("(orientation: portrait)");

        if(this.matchMedia.media !=  "(orientation: portrait)"){
            alert("Please use Landscape Orientation ");
            return;
        } 

        this.#offset = 0;
        this.#vuforiaScope = vuforiaScope;
        this.#canvasWidth = canvasWidth - (2 * this.#offset);
        this.#canvasHeight = canvasHeight - (2 * this.#offset);
        this.#markupWidth = markupWidth;
        this.#markupColor = markupColor;
        this.#markupType = "marker";

        this.#savedCanvas = document.createElement('canvas');
        this.#savedCanvas.width = this.#canvasWidth;
        this.#savedCanvas.height = this.#canvasHeight;   
        this.#savedCanvas.getContext("2d").clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);


    }

    set vuforiaScope(vuforiaScope) {

        this.#vuforiaScope = vuforiaScope;
        console.log(">>>>"+this.#vuforiaScope.app);

    }

    get vuforiaScope() {

        return this.#vuforiaScope ;

    }

    get canvasWidth() {

        return this.#canvasWidth;
    }

    set canvasWidth(canvasWidth) {

        this.#canvasWidth = canvasWidth;

    }

    get canvasHeight() {

        return this.#canvasHeight;
    }

    set canvasHeight(canvasHeight) {

        this.#canvasHeight = canvasHeight;

    }

    get markupColor() {

        return this.#markupColor;
    }

    set markupColor(markupColor) {

        this.#markupColor = markupColor;

    }

    get markupWidth() {

        return this.#markupWidth;
    }

    set markupWidth(markupWidth) {

        this.#markupWidth = markupWidth;

    }

    get markupType() {

        return this.#markupType;
    }

    set markupType(markupType) {

        this.#markupType = markupType;

    }

    get canvasLens() {

        return this.#lensCanvas;

    }

    set canvasLens(canvasLens) {

        this.#lensCanvas = canvasLens;

    }

    get imgElement() {

        return this.#imgElement;

    }

    set imgElement(imgElement) {

        this.#imgElement = imgElement;

    }

    get mainElement() {

        return this.#mainElement;

    }

    set backgroundLensimgsrc (backgroundLensimgsrc) {
        this.#backgroundLensimgsrc = backgroundLensimgsrc;

    }

    get backgroundLensimgsrc() {

        return this.#backgroundLensimgsrc;

    }




    getCursorPos(e) {
        let a, x = 0, y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = this.#imgElement.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset + 5;
        y = y - window.pageYOffset + 5;
        return { x: x, y: y };
    }

    doDraw(pos ) {


        this.#lensCanvas.getContext("2d").lineWidth = this.#markupWidth;
        this.#lensCanvas.getContext("2d").lineCap = 'round';
        this.#lensCanvas.getContext("2d").strokeStyle = this.#markupColor;

        if (this.#markupType === "arrow") {

            this.#lensCanvas.getContext("2d").clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);

            try {
                this.drawArrow(this.#lensCanvas.getContext("2d") , this.#startX, this.#startY,pos.x, pos.y);
                
            } catch (error) {
                alert("Draw Arrow error "+ error);
            }

        } else  {

            this.#lensCanvas.getContext("2d").lineTo(pos.x, pos.y);
            this.#lensCanvas.getContext("2d").stroke();
  
        }

    }





    // arrow = shaft + tip
    //
    // t argument indicates in % how big should be shaft part in drawn arrow
    // t should be in range from 0 to 1
    // t can be interpreted as: t = shaftLength / arrowLength
    //
    drawArrow = (context, x1, y1, x2, y2, t = 0.9) => {
        const arrow = {
            dx: x2 - x1,
            dy: y2 - y1
        };
            const middle = {
            x: arrow.dx * t + x1,
            y: arrow.dy * t + y1
        };
        const tip = {
            dx: x2 - middle.x,
            dy: y2 - middle.y
        };
  
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(middle.x, middle.y);
        context.moveTo(middle.x + 0.5 * tip.dy, middle.y - 0.5 * tip.dx);
        context.lineTo(middle.x - 0.5 * tip.dy, middle.y + 0.5 * tip.dx);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
       
    };

    drawBoarder =  () => {


        let context = this.#lensCanvas.getContext("2d");
        context.lineWidth = 80;
        context.strokeStyle = 'rgba(73, 89, 53, 0.50)';
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.#canvasWidth, 0 );
        context.lineTo(this.#canvasWidth, this.#canvasHeight);
        context.lineTo(0 , this.#canvasHeight);
        context.lineTo(0, 0);
        context.stroke();



        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();

        var today = mm + '/' + dd + '/' + yyyy + " "+ time;
        context.font = '30px serif';
        context.fillStyle = 'rgba(255, 213, 0, 0.5)';
        context.fillText(today, 10, 30);

    }


    setupLens ( backgroundLensimgsrc , imgElement) {
      this.#markupType = "marker";
      this.#backgroundLensimgsrc = backgroundLensimgsrc;
      this.#imgElement = imgElement;
      this.doLens();
  
    }

    clearLens (imgsrc) {

        this.#backgroundLensimgsrc = imgsrc;
        this.doLens();

    }

    doLens() {

        if (!this.#LENS_ALREADY_DEFINED) {
            //check if lens from previous
            let existingDiv = document.getElementById('lensmarkup');
            if (existingDiv != undefined) {
                existingDiv.remove();
            }

            this.lens = document.createElement("DIV");
            this.lens.setAttribute('id', "lensmarkup");

            this.#lensCanvas = document.createElement('canvas');
            this.#lensCanvas.width = this.#canvasWidth;
            this.#lensCanvas.height = this.#canvasHeight;
            
            this.#lensCanvas.getContext("2d").clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);
            this.lens.appendChild(this.#lensCanvas);

           // this.lens.setAttribute("class", "img-zoom-lens");
            this.lens.style.left = 0 + "px";
            this.lens.style.top = 0 + "px";
            this.lens.style.width = this.#canvasWidth;
            this.lens.style.height = this.#canvasHeight;
            this.lens.style.position = 'absolute';
            // this.lens.style.border = '5px solid #d4d4d4';

            this.#imgElement.parentElement.insertBefore(this.lens, this.#imgElement);

            this.lens.addEventListener("mousedown", (e) => {
                this.#IS_PAINTING = true;
                this.#startX = e.x;
                this.#startY = e.y;

            });

            this.lens.addEventListener("mouseup", (e) => {

                this.#IS_PAINTING = false;
                this.#lensCanvas.getContext("2d").stroke();
                this.#lensCanvas.getContext("2d").beginPath();

                this.#imgElement.src =  this.drawMarkupOntoImage();
                this.#backgroundLensimgsrc = this.#imgElement.src;
                this.doLens();

            });

            this.lens.addEventListener("mousemove", (e) => {
                if (!this.#IS_PAINTING) {
                    return;
                }
                let pos = this.getCursorPos(e);
                this.doDraw(pos);

            });


            this.lens.addEventListener("touchstart", (e) => {
                this.#IS_PAINTING = true;
                this.#startX = e.touches[0].screenX;
                this.#startY = e.touches[0].screenY;
            });

            this.lens.addEventListener("touchend", (e) => {
                this.#IS_PAINTING = false;
                this.#lensCanvas.getContext("2d").stroke();
                this.#lensCanvas.getContext("2d").beginPath();

                this.#imgElement.src =  this.drawMarkupOntoImage();
                this.#backgroundLensimgsrc = this.#imgElement.src;
                this.doLens();

            });

            this.lens.addEventListener("touchmove", (e) => {

                if (!this.#IS_PAINTING) {
                    return;
                }
                let x = e.touches[0].screenX;
                let y = e.touches[0].screenY;
                //let pos = this.getCursorPos(e);
                this.doDraw({x:x, y:y});
 

            });
   

        }
    }


    drawMarkupOntoImage() {

        let ctx = this.#lensCanvas.getContext("2d");
        let image = new Image();
        image.src = this.#backgroundLensimgsrc;

        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.#canvasWidth, this.#canvasHeight);
        ctx.globalCompositeOperation = 'source-over';
        return  this.#lensCanvas.toDataURL();

    }

};

class MarkupUI {

    markupCanvas;
    imgsrc;

    width;
    height;
    markupType;

    blackspot;
    redSpot;
    yellowspot;
    bluespot;
    infoButton;

    constructor( canvas, width, height , imgsrc ) {

        this.markupCanvas = canvas;
        this.width = width;
        this.height = height;
        this.imgsrc = imgsrc;
        


 
    }


    toggleSelectedColor (element) {

        this.blackspot.src = "extensions/images/Markup_blackspot.png";
        this.yellowspot.src = "extensions/images/Markup_yellowspot.png";
        this.redspot.src = "extensions/images/Markup_redspot.png";
        this.bluespot.src = "extensions/images/Markup_bluespot.png";

        if (element.id === "black") {
            element.src = "extensions/images/Markup_blackspotSelected.png";
        } else if (element.id === "yellow") {
            element.src = "extensions/images/Markup_yellowspotSelected.png";
        } else if (element.id === "blue") {
            element.src = "extensions/images/Markup_bluespotSelected.png";
        } else if (element.id === "red") {
            element.src = "extensions/images/Markup_redspotSelected.png";
        }

    }

    

    buildMarkUpUI = function () {

        let CenterPanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
            'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content > div.panel.body.undefined > div.panel.undefined.center';
    
        let CenterPanelSelector = document.querySelector(CenterPanelQuery);

        var UIContainer = document.createElement('div');
        UIContainer.id = 'ui-container';
        UIContainer.className = '';
        UIContainer.style.position = "absolute"; //Allowed values: static, absolute, fixed, relative, sticky, initial, inherit;  
        
        let leftposition =  1 ; 

        UIContainer.style.top = "1px"; 
        UIContainer.style.left = leftposition + "px";
        UIContainer.style.width = this.width;
        UIContainer.style.height = this.height;
        UIContainer.style.backgroundColor = "transparent";
        UIContainer.style.display = "flex";
        UIContainer.style.flexDirection = "column";
        UIContainer.style.zIndex =  '999';

        var MarkupToolbarContainer = document.createElement('div');
        MarkupToolbarContainer.id = 'markup-toolbar--container'; 
        MarkupToolbarContainer.style.position = "absolute";
        MarkupToolbarContainer.style.width = this.width;
        MarkupToolbarContainer.style.height = "50px";
        MarkupToolbarContainer.style.border = 'solid 1px rgba(0,0,0,0.1)';
        MarkupToolbarContainer.style.backgroundColor = "rgba(74,187,7)";
        MarkupToolbarContainer.style.top = "2px";
  

        this.yellowspot = document.createElement('img');
        this.yellowspot.id = "yellow";
        this.yellowspot.style.position = "absolute";
        this.yellowspot.style.top = "6px";
        this.yellowspot.style.left = "10px";
        this.yellowspot.setAttribute("height", "48px");
        this.yellowspot.setAttribute("width", "48px");
        this.yellowspot.style.backgroundColor = "rgba(74,187,7)";
        this.yellowspot.src = "extensions/images/Markup_yellowspot.png";
        MarkupToolbarContainer.appendChild(this.yellowspot);
    
        this.yellowspot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#fbc93d"; 
            this.toggleSelectedColor (this.yellowspot);
        });
    
        this.redspot = document.createElement('img');
        this.redspot.id = "red";
        this.redspot.style.position = "absolute";
        this.redspot.style.top = "6px";
        this.redspot.style.left = "58px";
        this.redspot.setAttribute("height", "48px");
        this.redspot.setAttribute("width", "48px");
        this.redspot.style.backgroundColor = "rgba(74,187,7)";
        this.redspot.src = "extensions/images/Markup_redspot.png";
        MarkupToolbarContainer.appendChild(this.redspot);
    
        this.redspot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#fb4f4f";
            this.toggleSelectedColor (this.redspot);
        });
    
        this.bluespot = document.createElement('img');
        this.bluespot.id = "blue";
        this.bluespot.style.position = "absolute";
        this.bluespot.style.top = "6px";
        this.bluespot.style.left = "106px";
        this.bluespot.setAttribute("height", "48px");
        this.bluespot.setAttribute("width", "48px");
        this.bluespot.style.backgroundColor = "rgba(74,187,7)";
        this.bluespot.src = "extensions/images/Markup_bluespot.png";
        MarkupToolbarContainer.appendChild(this.bluespot);
    
        this.bluespot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#6cc0e5"; 
            this.toggleSelectedColor (this.bluespot);
        });
    
        this.blackspot = document.createElement('img');
        this.blackspot.id = "black";
        this.blackspot.style.position = "absolute";
        this.blackspot.style.top = "6px";
        this.blackspot.style.left = "154px";
        this.blackspot.style.backgroundColor = "rgba(74,187,7)";
        this.blackspot.setAttribute("height", "48px");
        this.blackspot.setAttribute("width", "48px");
        this.blackspot.src = "extensions/images/Markup_blackspot.png";

        MarkupToolbarContainer.appendChild(this.blackspot);
    
        this.blackspot.addEventListener("click", () => { 
            this.markupCanvas.markupColor = "#000000"; 
            this.toggleSelectedColor (this.blackspot);
        });
    
        var marker = document.createElement('img');
        marker.style.position = "absolute";
        marker.style.top = "6px";
        marker.style.left = "202px";
        marker.setAttribute("height", "48px");
        marker.setAttribute("width", "48px");
        marker.style.backgroundColor = "rgba(74,187,7)";
        marker.src = "extensions/images/Markup_marker.png";
        MarkupToolbarContainer.appendChild(marker);
    
        marker.addEventListener("click",  () => { 
            this.markupCanvas.markupType = "marker"; 
            marker.src = "extensions/images/Markup_markerSelected.png";
            arrow.src = "extensions/images/Markup_arrow.png";
        });


        var arrow = document.createElement('img');
        arrow.style.position = "absolute";
        arrow.style.top = "6px";
        arrow.style.left = "250px";
        arrow.setAttribute("height", "48px");
        arrow.setAttribute("width", "48px");
        arrow.style.backgroundColor = "rgba(74,187,7)";
        arrow.src = "extensions/images/Markup_arrow.png";
        MarkupToolbarContainer.appendChild(arrow);
    
        arrow.addEventListener("click",  () => { 
            this.markupCanvas.markupType = "arrow";
            marker.src = "extensions/images/Markup_marker.png";
            arrow.src = "extensions/images/Markup_arrowSelected.png";
        });

  
    
        var ResetButton = document.createElement('img');
        ResetButton.style.position = "absolute";
        ResetButton.style.top = "6px";
        ResetButton.style.left = "298px";
        ResetButton.style.height = "48px";
        ResetButton.style.width = "48px";
        ResetButton.src = "extensions/images/Markup_reset.png";
        ResetButton.style.backgroundColor = "rgba(74,187,7)";
        MarkupToolbarContainer.appendChild(ResetButton);
    
        ResetButton.addEventListener("click",  () => { 

            UIContainer.innerHTML = "" ;
            this.markupCanvas.setupLens( this.imgsrc, this.buildMarkUpUI());
    
        });
    
        var CloseButton = document.createElement('img');
        CloseButton.style.height = "48px";
        CloseButton.style.width = "48px";
        CloseButton.style.position = "absolute";
        CloseButton.style.top = "6px";
        CloseButton.style.left = "346px";
        CloseButton.src = "extensions/images/Markup_save.png";
        CloseButton.style.backgroundColor = "rgba(74,187,7)";
    
        CloseButton.addEventListener("click",  () => { 
            UIContainer.innerHTML = "" ;

            if (this.markupCanvas.vuforiaScope.markupField != undefined && this.markupCanvas.vuforiaScope.markupField != '' ) {
                this.markupCanvas.drawBoarder();
                this.markupCanvas.vuforiaScope.markedupField =  this.markupCanvas.drawMarkupOntoImage( );
                this.markupCanvas.vuforiaScope.$applyAsync();

            }
        });

        MarkupToolbarContainer.appendChild(CloseButton);

        // var UndoButton = document.createElement('img');

        // UndoButton.style.height = "48px";
        // UndoButton.style.width = "75px";
        // UndoButton.style.position = "absolute";
        // UndoButton.style.top = "6px";
        // UndoButton.style.left = "450px";
        // UndoButton.style.backgroundColor = "rgba(74,187,7)";
        // UndoButton.src = "app/resources/Uploaded/Markup_reset.png";
        // UndoButton.addEventListener("click",  () => { 
        //     UIContainer.innerHTML = "" ;
        //     this.markupCanvas.setupLens( this.markupCanvas.previousImage, this.buildMarkUpUI());
    
        // });
    
        // MarkupToolbarContainer.appendChild(UndoButton);



    
        let MarkupContainer = document.createElement('div');
        MarkupContainer.id = "markup-container";
        let imgElement = document.createElement('img');
        imgElement.id = "imgElement";
        imgElement.style.border = '5px solid #d4d4d4';
        imgElement.setAttribute("width", this.width);
        imgElement.setAttribute("height", this.height);
        imgElement.src = this.imgsrc;
  
        MarkupContainer.appendChild(imgElement);


        // var table = document.createElement('table');

        //     var tr1 = document.createElement('tr');   
        //     var td1 = document.createElement('td');
        //     td1.appendChild(MarkupToolbarContainer);
        //     tr1.appendChild(td1);
        //     var tr2 = document.createElement('tr');   
        //     var td2 = document.createElement('td');
        //     td2.appendChild(MarkupContainer);
        //     tr2.appendChild(td2);
        //     table.appendChild(tr1);
        //     table.appendChild(tr2);
    

        //     table.style.position = "fixed"; //Allowed values: static, absolute, fixed, relative, sticky, initial, inherit;   
        //     table.style.top = "15vh";
        //     table.style.left = "2vh";
        //     table.style.backgroundColor = "transparent";
            //CenterPanelSelector.appendChild(table);

        //Append the div to the higher level div 
        UIContainer.appendChild(MarkupContainer);
        UIContainer.appendChild(MarkupToolbarContainer);
 

        this.toggleSelectedColor (this.yellowspot);
        marker.src = "extensions/images/Markup_markerSelected.png";
        arrow.src = "extensions/images/Markup_arrow.png";


        //this.markupCanvas.parentNode.insertBefore(MarkupToolbarContainer,this.markupCanvas);
     
    
        //Append the div to the higher level div  
        CenterPanelSelector.appendChild(UIContainer);

        this.markupCanvas.markupColor = "#fbc93d"; 
        this.toggleSelectedColor (this.yellowspot);
        this.markupCanvas.markupType = "marker";

      return imgElement;
    }


}



