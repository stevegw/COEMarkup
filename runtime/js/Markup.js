class Markup {

    markupUI;

    constructor( vuforiaScope, imgsrc, includeborder, includedatestamp , markupColor ,markupWidth='5' , markupresizescale  ) {

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
   
        if (  String(markupColor).toLowerCase === "black" || markupColor === "#000000" ) {
            markupColor = "#000000";
        } else if (String(markupColor).toLowerCase === "red" || markupColor === "#FF0000") {
            markupColor = "#FF0000";
        } else if (String(markupColor).toLowerCase === "yellow" || markupColor === "#FFFF00") {
            markupColor = "#FFFF00";
        } else if (String(markupColor).toLowerCase === "blue" || markupColor === "#0000FF") {
            markupColor = "#0000FF";
        } else {
            markupColor = "#FFFF00";
        }

        console.log("canvasWidth=" + canvasWidth + " canvasHeight=" + canvasHeight);

        let markupCanvas = new MarkupCanvas(vuforiaScope,canvasWidth,canvasHeight , includeborder, includedatestamp , markupColor , markupWidth , markupresizescale );
        this.markupUI = new MarkupUI(markupCanvas, canvasWidth,canvasHeight ,imgsrc , );
        markupCanvas.setupLens( imgsrc, this.markupUI.buildMarkUpUI());



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
    #includeborder;
    #includedatestamp;
    #markupWidth;
    #markupColor;
    #markupResizeScale;
    #markupType;
    #vuforiaScope;
    #backgroundLensimgsrc;
    #startX;
    #startY;
    #savedCanvas;
    #offset;
 
    constructor( vuforiaScope, canvasWidth , canvasHeight, includeborder, includedatestamp,   markupColor , markupWidth , markupResizeScale ) {


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
        this.#markupResizeScale = markupResizeScale;
        
        this.#includeborder = includeborder;
        this.#includedatestamp = includedatestamp;

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

    get markupResizeScale() {

        return this.#markupResizeScale;
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

    drawBoarder =  (scale) => {


        let context = this.#lensCanvas.getContext("2d");

        if (this.#includeborder === 'true') {
            context.lineWidth = 80;
            context.strokeStyle = 'rgba(73, 89, 53, 0.50)';
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(scale*(this.#canvasWidth), 0) ;
            context.lineTo(scale*(this.#canvasWidth), scale*(this.#canvasHeight));
            context.lineTo(0 , scale*(this.#canvasHeight));
            context.lineTo(0, 0);
            context.stroke();
        }


        if (this.#includedatestamp === 'true') {

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

    scaleMarkupImage(scale) {

        let ctx = this.#lensCanvas.getContext("2d");
        let image = new Image();
        image.src = this.#backgroundLensimgsrc;

        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, scale*(this.#canvasWidth), scale*(this.#canvasHeight));
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
    imgElement;
    markup;



    constructor( canvas, width, height , imgsrc , markup) {

        this.markupCanvas = canvas;
        this.width = width;
        this.height = height;
        this.imgsrc = imgsrc;
        this.markup = markup;

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

        this.imgElement.style.borderColor = this.markupCanvas.markupColor;

    }

    //
    // This was created in the hope that a data grid widget would except the data from local endpoint
    // currentlt a Datagrid only excepts THX endpoints.
    // I could remove this but maybe in the future it will work
    //
    buildInfoTable= function (rows) {
        var itable = { 
                rows: rows,
          dataShape: {
            fieldDefinitions: {
                image: {aspects: {}, baseType: "STRING",  name: "value"   }
            }
          }
        };     
        return itable;
      }

    

    buildMarkUpUI = function () {

        let CenterPanelQuery3D = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
            'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content > div.panel.body.undefined > div.panel.undefined.center';
    
        let CenterPanelQuery2D = '.twx-view-overlay';
        let query3D  = document.querySelector(CenterPanelQuery3D);
        let query2D  = document.querySelector(CenterPanelQuery2D);

        if (query3D != undefined) {
            this.CenterPanelSelector = query3D;
        } else {
            this.CenterPanelSelector = query2D;
        }

        var UIContainer = document.createElement('div');
        UIContainer.id = 'ui-container';
        UIContainer.className = 'ui-container';
        UIContainer.style.width = this.width;
        UIContainer.style.height = this.height;

        var MarkupToolbarContainer = document.createElement('div');
        MarkupToolbarContainer.id = 'markup-toolbar--container';
        MarkupToolbarContainer.className = 'markup-toolbar';
  

        this.yellowspot = document.createElement('img');
        this.yellowspot.id = "yellow";
        this.yellowspot.className = "yellow";
        MarkupToolbarContainer.appendChild(this.yellowspot);
    
        this.yellowspot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#f5b231";
            this.toggleSelectedColor (this.yellowspot);
        });
    
        this.redspot = document.createElement('img');
        this.redspot.id = "red";
        this.redspot.className = "red";
        MarkupToolbarContainer.appendChild(this.redspot);
    
        this.redspot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#ff4949";
            this.toggleSelectedColor (this.redspot);
        });
    
        this.bluespot = document.createElement('img');
        this.bluespot.id = "blue";
        this.bluespot.className = "blue";
        MarkupToolbarContainer.appendChild(this.bluespot);
    
        this.bluespot.addEventListener("click",  () => { 
            this.markupCanvas.markupColor = "#0babc7";
            this.toggleSelectedColor (this.bluespot);
        });
    
        this.blackspot = document.createElement('img');
        this.blackspot.id = "black";
        this.blackspot.className = "black";

        MarkupToolbarContainer.appendChild(this.blackspot);
    
        this.blackspot.addEventListener("click", () => { 
            this.markupCanvas.markupColor = "#000000"; 
            this.toggleSelectedColor (this.blackspot);
        });
    
        var marker = document.createElement('img');
        marker.style.position = "absolute";
        marker.className = "toolbarmarkerbutton";
        MarkupToolbarContainer.appendChild(marker);
    
        marker.addEventListener("click",  () => { 
            this.markupCanvas.markupType = "marker"; 
            marker.src = "extensions/images/Markup_markerSelected.png";
            arrow.src = "extensions/images/Markup_arrow.png";
        });


        var arrow = document.createElement('img');
        arrow.className = "toolbararrowbutton";
        MarkupToolbarContainer.appendChild(arrow);
    
        arrow.addEventListener("click",  () => { 
            this.markupCanvas.markupType = "arrow";
            marker.src = "extensions/images/Markup_marker.png";
            arrow.src = "extensions/images/Markup_arrowSelected.png";
        });

  
    
        var ResetButton = document.createElement('img');
        ResetButton.className = "toolbarresetbutton";
        ResetButton.src = "extensions/images/Markup_reset.png";
        MarkupToolbarContainer.appendChild(ResetButton);
    
        ResetButton.addEventListener("click",  () => { 

            // try { 
            //     this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
            // } catch (ex) {

            // }

            UIContainer.innerHTML = "" ;
            this.markupCanvas.setupLens( this.imgsrc, this.buildMarkUpUI());
    
        });
    

        var FinishButton = document.createElement('img');
        FinishButton.className = "toolbarfinishbutton";
        FinishButton.src = "extensions/images/Markup_save.png";


        FinishButton.addEventListener("click",  () => { 
            UIContainer.innerHTML = "" ;

            if (this.markupCanvas.vuforiaScope.markupField != undefined && this.markupCanvas.vuforiaScope.markupField != '' ) {

                if (Number(this.markupCanvas.markupResizeScale) != undefined &&  this.markupCanvas.markupResizeScale != "") {
                   // Scale image data


                  let scale = Number(this.markupCanvas.markupResizeScale) / this.markupCanvas.canvasWidth; 

                   this.markupCanvas.drawBoarder(Number(this.markupCanvas.markupResizeScale));
                   this.markupCanvas.vuforiaScope.markedupField =  this.markupCanvas.scaleMarkupImage(scale);
                   let imageObj = new Object();
                   imageObj.image = this.markupCanvas.scaleMarkupImage(scale);
                   this.markupCanvas.vuforiaScope.data.sessionimages.push(imageObj);
                   this.markupCanvas.vuforiaScope.sessionimagesField =  this.buildInfoTable(this.markupCanvas.vuforiaScope.data.sessionimages);
                   let contextArray = this.markupCanvas.vuforiaScope.markedupField.split(",");
                   this.markupCanvas.vuforiaScope.markedupdataField =  contextArray[1];

                } else {

                    this.markupCanvas.drawBoarder(1);
                this.markupCanvas.vuforiaScope.markedupField =  this.markupCanvas.drawMarkupOntoImage();
                let imageObj = new Object();
                imageObj.image = this.markupCanvas.drawMarkupOntoImage();
                this.markupCanvas.vuforiaScope.data.sessionimages.push(imageObj);
                this.markupCanvas.vuforiaScope.sessionimagesField =  this.buildInfoTable(this.markupCanvas.vuforiaScope.data.sessionimages);
                let contextArray = this.markupCanvas.vuforiaScope.markedupField.split(",");
                this.markupCanvas.vuforiaScope.markedupdataField =  contextArray[1];

                }

                //this.markupCanvas.vuforiaScope.$parent.fireEvent('markCompleted');
                this.markupCanvas.vuforiaScope.$parent.$applyAsync();
                this.close();
                //const myTimeout = setTimeout( this.markupCanvas.vuforiaScope.$parent.fireEvent('markCompleted'), 500);


            }
        });

        MarkupToolbarContainer.appendChild(FinishButton);


        var CancelButton = document.createElement('img');
        CancelButton.className = "toolbarcancelbutton";
        CancelButton.src = "extensions/images/Markup_cancel.png";
        CancelButton.addEventListener("click",  () => { 


            this.close();


            //this.CenterPanelSelector.removeChild(UIContainer);
    
        });

        MarkupToolbarContainer.appendChild(CancelButton);
        let MarkupContainer = document.createElement('div');
        MarkupContainer.id = "markup-container";
        this.imgElement = document.createElement('img');
        this.imgElement.id = "imgElement";
        this.imgElement.style.border = '5px solid';
        this.imgElement.style.borderColor = this.markupCanvas.markupColor;
        this.imgElement.setAttribute("width", this.width);
        this.imgElement.setAttribute("height", this.height);
        this.imgElement.src = this.imgsrc;
  
        MarkupContainer.appendChild(this.imgElement);
        //Append the div to the higher level div 
        UIContainer.appendChild(MarkupContainer);
        UIContainer.appendChild(MarkupToolbarContainer);
        this.toggleSelectedColor (this.yellowspot);
        marker.src = "extensions/images/Markup_markerSelected.png";
        arrow.src = "extensions/images/Markup_arrow.png";
        //Append the div to the higher level div  
        this.CenterPanelSelector.appendChild(UIContainer);

        if (this.markupCanvas.markupColor === "#000000" ) {
            //black
            this.toggleSelectedColor (this.blackspot);
        } else if (this.markupCanvas.markupColor === "#FF0000") {
            //red
            this.toggleSelectedColor (this.redspot);
        } else if (this.markupCanvas.markupColor === "#FFFF00") {
            //yellow
            this.toggleSelectedColor (this.yellowspot);
        } else if (this.markupCanvas.markupColor === "#0000FF") {
            //blue
            this.toggleSelectedColor (this.bluespot);
        } else {
            this.markupCanvas.markupColor = "#FFFF00"; 
        this.toggleSelectedColor (this.yellowspot);
        }

        this.markupCanvas.markupType = "marker";

      return this.imgElement;
    }

    close () {

        try { 


            while (this.CenterPanelSelector.hasChildNodes()) {
                this.CenterPanelSelector.removeChild(this.CenterPanelSelector.firstChild);
              }

            this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
        } catch (ex) {

        }
      
      }


}



