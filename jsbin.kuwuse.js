var totalElements = [];
var theSelected = '';
var lineStart = '';
var lineEnd = '';
var altKey = false;
function resize(e, u) {

}

function mouseMove(e) {
    //if (getSelected().getPaintingAllowed() && painting) {
    if (e.which == 3 && painting) {
        $('#sel-prev').text('');
        var con = getSelected().getContext().getImageData(0, 0, getSelected().getContext().canvas.width, getSelected().getContext().canvas.height);

        getSelected().getClass(true).clone().css('position', '').css('width', '100px').css('height', '100px').attr('prev', 'true').attr('left', '0px').attr('top', '0px').attr('class', '').appendTo('#sel-prev');
        $('#sel-prev canvas')[0].getContext('2d').putImageData(con, 0, 0);
        mouseX = (e.offsetX) ? e.offsetX : e.pageX - e.target.offsetLeft;
        mouseY = (e.offsetY) ? e.offsetY : e.pageY - e.target.offsetTop;
        getSelected().draw(mouseX, mouseY, level, $('#can-brush-type').val(), $('#can-brush-size').val());
    }
}
var done = false;
var mouseX2, mouseY2;

function mouseDown(e) {
    // if(getSelected().getPaintingAllowed()) {
    if (e.which == 3) {
        mouseX = (e.offsetX) ? e.offsetX : e.pageX - e.target.offsetLeft;
        mouseY = (e.offsetY) ? e.offsetY : e.pageY - e.target.offsetTop;
        if ($('#can-brush-type').val() == 'line' && !done) {
            mouseX2 = mouseX;
            mouseY2 = mouseY;
            console.log('1');
        } else if ($('#can-brush-type').val() == 'line' && done) {
            getSelected().getContext().beginPath();
            getSelected().getContext().moveTo(mouseX2, mouseY2);
            getSelected().getContext().strokeStyle = $('.menu-color-picker').minicolors('value');
                        getSelected().getContext().lineWidth = $('#can-brush-size').val();

            getSelected().getContext().lineTo(mouseX, mouseY);
            getSelected().getContext().stroke();
            getSelected().getContext().closePath();
            console.log('1');
            mouseX2 = 0;
            mouseY2 = 0;
        }
        if(painting) {
                    getSelected().draw(mouseX, mouseY, level, $('#can-brush-type').val(), $('#can-brush-size').val());

        }
    }
    getSelected().getClass(true)[0].getContext('2d').width = getSelected().getClass(false).css('width');
    getSelected().getClass(true)[0].getContext('2d').height = getSelected().getClass(false).css('height');
    var con = getSelected().getContext().getImageData(0, 0, getSelected().getClass().css('width').replace('px', ''), getSelected().getClass().css('height').replace('px', ''));
    getSelected().getClass(true).attr('width', getSelected().getClass().css('width'));
    getSelected().getClass(true).attr('height', getSelected().getClass().css('height'));

    getSelected().getContext().putImageData(con, 0, 0);
    mouseX = 0;
    mouseY = 0;
    level = 0;
    painting = true;
}

function mouseUp(e) {

    if ($('#can-brush-type').val() == 'line') {
        done = !done;
    }
    $('#sel-prev').text('');
    var con = getSelected().getContext().getImageData(0, 0, getSelected().getContext().canvas.width, getSelected().getContext().canvas.height);

    getSelected().getClass(true).clone().css('position', '').css('width', '100px').css('height', '100px').attr('prev', 'true').attr('left', '0px').attr('top', '0px').attr('class', '').appendTo('#sel-prev');
    $('#sel-prev canvas')[0].getContext('2d').putImageData(con, 0, 0);

    painting = false;
}

function mouseLeave(e) {
    $('#sel-prev').text('');
    var con = getSelected().getContext().getImageData(0, 0, getSelected().getContext().canvas.width, getSelected().getContext().canvas.height);
    getSelected().getClass(true).clone().css('position', '').css('width', '100px').css('height', '100px').attr('prev', 'true').attr('left', '0px').attr('top', '0px').attr('class', '').appendTo('#sel-prev');
    $('#sel-prev canvas')[0].getContext('2d').putImageData(con, 0, 0);
    painting = false;
}
var cOX, cOY;
var cNX, cNY;

function Element(width, height, id, theClass, color, rotation, borderRadius, border, selected, isCanvas) {
    this.width = width;
    this.height = height;
    this.id = id;
    this.theClass = theClass;
    this.color = color;
    this.rotation = rotation;
    this.borderRadius = borderRadius;
    this.border = border;
    this.isCanvas = isCanvas;
    this.selected = selected;
    this.canPaint = false;
    this.uid = jQuery.now();
    this.name = "object";
}

Element.prototype = {
    constructor: Element,
    init: function () {
        var El = $((this.isCanvas == true) ? "<canvas></canvas>" : "<div></div>");
        El.css({
            width: this.width,
            height: this.height,
            backgroundColor: this.color,
            borderTopLeftRadius: this.borderRadius[0],
            borderTopRightRadius: this.borderRadius[1],
            borderBottomLeftRadius: this.borderRadius[2],
            borderBottomRightRadius: this.borderRadius[3]
        });
        El.attr('id', this.id);
        El.attr('class', this.theClass);
        El.attr('selected', this.selected);
        El.attr('width', this.width);
        El.attr('height', this.height);
        totalElements.push($(this));
        $('#selectl').append('<option id=' + this.uid + '>' + (totalElements.length - 1) + '</option>');
        //Creates the new object on the document.
        El.appendTo($('body'));
        El.resizable({
            aspectRatio: false,
            handles: 'all',
            resize: function (event, ui) {
                $('#width').val(getSelected().getClass(true).css('width').replace('px', ''));
                $('#height').val(getSelected().getClass(true).css('height').replace('px', ''));
                var con = getSelected().getContext().getImageData(0, 0, getSelected().getContext().canvas.width, getSelected().getContext().canvas.height);
                El[0].getContext('2d').putImageData(con, 0, 0);
            },
            start: function (e, ui) {},
            stop: function (e, ui) {

            }
        });
        El.parent().draggable();
        El[0].addEventListener('mousemove', function (e) {
            mouseMove(e);
        });
        El[0].addEventListener('mouseup', function (e) {
            mouseUp(e);
        });
        El[0].addEventListener('mousedown', function (e) {
            mouseDown(e);
        });
        El[0].addEventListener('mouseleave', function (e) {
            mouseLeave(e);
        });
        this.getClass().bind("contextmenu", function (e) {
            console.log();
            if(e.currentTarget.firstChild.className.split(' ')[0] != getSelected().theClass) {
                painting = false;
                return false;
            }
    return false;
});
        this.getClass().bind('dblclick', function(e) {
            var clicked = e.target.id.replace('content', '');
            theSelected = totalElements[(clicked == '') ? 0 : clicked][0];
});

    },
    //Removes the objects and deletes the referance
    update: function () {
        this.getClass(true).css({
            backgroundColor: this.color
        });
        this.getClass(true).css({
            borderTopLeftRadius: this.borderRadius[0],
            borderTopRightRadius: this.borderRadius[1],
            borderBottomLeftRadius: this.borderRadius[2],
            borderBottomRightRadius: this.borderRadius[3]
        });
    },
    destroy: function () {
        //totalElements.splice($.inArray(this, totalElements), 1);
        console.log(totalElements);
        this.getClass(true).remove();
        $('#selectl option:selected').text('DELETED');
        //theSelected = totalElements[0];
    },
    setDrag: function (opt) {
        // $(this).draggable(true);
        if (opt) {
            this.getClass().draggable();
        } else {
            this.getClass().draggable("destroy");
        }
    },
    setWidth: function (width) {
        this.width = width;
    },
    setName: function (v) {
        this.name = v;
    },
    setHeight: function (height) {
        this.height = height;
    },
    setId: function (id) {
        this.id = id;
    },
    setClass: function (theClass) {
        this.theClass = theClass;
    },
    setAttr: function (k, v) {
        this.getClass().attr(k, v);
    },
    setColor: function (color) {
        if(altKey) {
            getSelected().getContext().strokeStyle = $('.menu-color-picker').minicolors('value');
            getSelected().getContext().fillStyle = $('.menu-color-picker').minicolors('value');
        } else {
            this.color = color;
            this.update();
        }
    },
    setRotation: function (rotation) {
        this.rotation = rotation;
    },
    setBorderRadius: function (borderRadius) {
        this.borderRadius = borderRadius;
        this.update();
    },
    setBorder: function (border) {
        this.border = border;
        this.update();
    },
    setCanvas: function (isCanvas) {
        this.isCanvas = isCanvas;
    },
    setOption: function (k, v) {
        this[k] = v;
    },
    getUID: function () {
        return this.uid;
    },
    togglePaint: function () {
        this.canPaint = !this.canPaint;
    },
    getClass: function (e) {
        if (e) {
            return $('.' + this.theClass);
        } else {
            return $('.' + this.theClass).parent();
        }
    },
    getPaintingAllowed: function () {
        return this.canPaint;
    },
    getContext: function () {
        return this.getClass(true)[0].getContext('2d');
    },
    getName: function () {
        return this.name;
    },
    draw: function (mouseX, mouseY, level, brushType, brushSize) {
        //c.fillStyle = "hsl("+(level*5)+", 100%, 50%)"; 



        this.getContext().fillStyle = $('.menu-color-picker').minicolors('value');
        this.getContext().strokeStyle = $('.menu-color-picker').minicolors('value');
        this.getContext().lineJoin = 'round';
        this.getContext().beginPath();
        if (brushType == 'arc') {
            this.getContext().arc(mouseX, mouseY, brushSize, 0, Math.PI * 2, true);
            this.getContext().fill();
        } else if (brushType == 'rect') {
            this.getContext().fillRect(mouseX, mouseY, brushSize, brushSize);
            this.getContext().fill();
        } else if (brushType == 'lRect') {
            this.getContext().rect(mouseX, mouseY, brushSize, brushSize);
            this.getContext().stroke();
        } else if (brushType == 'empty') {
            this.getContext().clearRect(mouseX, mouseY, brushSize, brushSize);
        }
        this.getContext().closePath();
        level++;
    }
}

function UI(width, height, theClass, draggable) {
    this.width = width;
    this.height = height;
    this.theClass = theClass;
    this.draggable = draggable;
}

UI.prototype = {
    init: function () {
        var menu = $('<div>');
        menu.css({
            width: this.width,
            height: this.height
        });
        menu.attr('class', this.theClass);
        menu.appendTo('body');
        menu.draggable({
            addClasses: false
        });
    },
    addInput: function (type, value, placeholder, min, max, theClass, id, append) {
        var input = $('<input>');
        input.attr('type', type);
        input.attr('placeholder', placeholder);
        input.attr('min', min);
        input.attr('max', max);
        input.attr('class', theClass);
        input.attr('id', id);
        input.val(value);
        input.appendTo(append);
    },
    newLine: function (append, parent) {
        $('<br>').appendTo((parent) ? $('.' + append).parent() : '.' + append);
    },
    addSelect: function (options, append) {
        var select = $('<select>');
        select.attr('id', 'selectl');
        if (options[0] == 'new') {

        } else {
            for (i in options) {
                select.append('<option>' + options[i] + '</option>');
            }
        }
        select.appendTo(append);
    },
    insertOption: function (text, append) {
        var option = $('<option>' + text + '</option>');
        option.appendTo(append);
    },
    addText: function (t, id) {
        $('<div class="menu-text" id="' + id + '">' + t + '</div>').appendTo('.new-menu');
    },
    newSection: function (sec, e) {
        $('<div id="' + sec + '" class="section">' + e + '</div>').appendTo('.new-menu');
    },
    createDial: function (append, e, type, size, colour) {
        $('<input class="' + e + '" data-angleoffset="90" data-fgColor="' + colour + '" data-linecap="round" data-width="' + size + '" data-min="1" data-max="360" value="1" style="vertical-align: middle; margin-top: 66px; margin-left: -152px; border: 0px; font-weight: bold; font-style: normal; font-variant: normal; font-size: 40px; line-height: normal; font-family: Arial; text-align: center; color: rgb(135, 206, 235); padding: 0px; -webkit-appearance: none; background: none;">').appendTo(append);


        $('.' + e).knob({
            change: function (value) {
                //console.log("change : " + value);
                if (type == 'rotate') {
                    getSelected().getClass().animateRotate(startA, value, 1000);
                    startA = value;
                }
                if (type == 'borderRadius') {
                    getSelected().setBorderRadius([
                    value + 'px',
                    value + 'px',
                    value + 'px',
                    value + 'px']);
                }
                if (type == 'borderTopLeftRadius') {
                    getSelected().setBorderRadius([
                    value + 'px',
                    getSelected().getClass().css('borderTopRightRadius') + 'px',
                    getSelected().getClass().css('borderBottomLeftRadius') + 'px',
                    getSelected().getClass().css('borderBottomRightRadius') + 'px']);
                } else if (type == 'borderTopRightRadius') {
                    getSelected().setBorderRadius([
                    getSelected().getClass().css('borderTopLeftRadius') + 'px',
                    value + 'px',
                    getSelected().getClass().css('borderBottomLeftRadius') + 'px',
                    getSelected().getClass().css('borderBottomRightRadius') + 'px']);
                } else if (type == 'borderBottomLeftRadius') {
                    getSelected().setBorderRadius([
                    getSelected().getClass().css('borderTopLeftRadius') + 'px',
                    getSelected().getClass().css('borderTopRightRadius') + 'px',
                    value + 'px',
                    getSelected().getClass().css('borderBottomRightRadius') + 'px']);
                } else if (type == 'borderBottomRightRadius') {
                    getSelected().setBorderRadius([
                    getSelected().getClass().css('borderTopLeftRadius') + 'px',
                    getSelected().getClass().css('borderTopRightRadius') + 'px',
                    getSelected().getClass().css('borderBottomLeftRadius') + 'px',
                    value + 'px']);
                }
            },
            release: function (value) {

            },
            cancel: function () {
                console.log("cancel : " + this.value);
            },
            draw: function () {

                // "tron" case
                if (this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv) // Angle
                    ,
                        sa = this.startAngle // Previous start angle
                        ,
                        sat = this.startAngle // Start angle
                        ,
                        ea // Previous end angle
                        ,
                        eat = sat + a // End angle
                        ,
                        r = true;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
        if ($('#el-prop .kn').has($('.' + e))) {
            if (e == 'knob' || e == 'knob5') {
                $('.' + e).parent().children('canvas').attr('width', '50px');
                $('.' + e).parent().children('canvas').attr('height', '50px');
                $('.' + e).parent().css('height', '50px');
                $('.' + e).parent().css('margin-left', 'auto');
                $('.' + e).parent().css('margin-right', 'auto').css('display', 'inline');
            } else if (e == 'knob1' || e == 'knob2' || e == 'knob3' || e == 'knob4') {
                $('.' + e).parent().children('canvas').attr('width', '35px');
                $('.' + e).parent().children('canvas').attr('height', '35px');
                $('.' + e).parent().css('height', '35px');
                $('.' + e).parent().css('display', 'inline-block');
            }
        }
        $('#el-prop div').attr('class', 'kn');
        //$('.' + e).parent().draggable();

    },
    createColorPicker: function (e) {
        $('<input class="' + e + '" data-inline="true""></input>').appendTo('.new-menu');
        $('.' + e).minicolors({
            inline: true,
            opacity: true,
            change: function (hex, opacity) {
                var log;
                try {
                    log = hex ? hex : 'transparent';
                    if (opacity) log += ', ' + opacity;
                    
                                            getSelected().setColor($('.' + e).val());

                } catch (es) {}
            },
            theme: 'default'
        });
    }
}

var canvas, c,
mouseX = 0,
    mouseY = 0,
    level = 0;

var brushSize = 10,
    brushType = 'arc';

var firstObject = new Element(250, 250, 'content', 'content', 'rgba(255, 0, 0, 1)', '0deg', [0, 0, 0, 0], 'none', true, true);
var menu = new UI('160px', '500px', 'new-menu', true);
menu.init();
menu.addSelect(['new'], '.new-menu');
$(".new-menu").resizable({
    handles: "s",
    ghost: true,
    minHeight: 500,
    minWidth: 160
});

//Creates an object

firstObject.init();
theSelected = totalElements[0][0];

$('#selectl').on('change', function () {
    //for(i in totalElements) {
    theSelected = totalElements[$('#selectl').val()][0];
    console.log(theSelected);
    $('#selected').text(theSelected.name);
    // }
});
function getSelected() {
    var item;


    // $.each(totalElements, function (point, value) {
    //   console.log(point + ':' + value[point]);
    // if (value[point].isSelected()) {
    //  item = value[point];
    // }
    //  });
    //  console.log(theSelected);
    return theSelected;
}
var painting = false;
//console.log(getSelected().getPaintingAllowed());
//console.log(getSelected().getClass()[0]);


//    addInput: function (type, value, placeholder, min, max, theClass, id, append) {

menu.addText(getSelected().getName(), 'selected');

menu.newSection('sel-prev', '');
$('#selected').click(function () {
    $('#sel-prev').toggle();
    $('#sel-prev').text('');
    //   var con = getSelected().getContext().getImageData(0, 0, getSelected().getContext().canvas.width, getSelected().getContext().canvas.height);
    //   getSelected().getClass().clone().attr('prev', 'true').css('width', '100px').css('height', '100px').css('left', '0px').css('top', '0px').appendTo('#sel-prev');
    //   $('#sel-prev canvas')[0].getContext('2d').putImageData(con, 0, 0);
});

menu.addInput('submit', 'Clone', '', '', '', 'menu-button', 'clone', '.new-menu');
menu.addInput('submit', 'Canvas', '', '', '', 'menu-button', 'canvas', '.new-menu');
menu.addInput('submit', 'Delete', '', '', '', 'menu-button', 'delete', '.new-menu');
menu.createColorPicker('menu-color-picker');
menu.newSection('el-prop', 'Properties');
menu.addInput('text', 'Object', 'Element Name', '', '', 'menu-textfield', 'element-name', '#el-prop');
menu.addInput('number', '', 'Width', '0', '', 'menu-number', 'width', '#el-prop');
menu.addInput('number', '', 'Height', '0', '', 'menu-number', 'height', '#el-prop');
menu.createDial('#el-prop', 'knob', 'rotate', 50, 'rgb(96, 223, 96)');
menu.createDial('#el-prop', 'knob5', 'borderRadius', 50, 'rgb(96, 223, 96)');
menu.newLine('knob5', true);
menu.createDial('#el-prop', 'knob1', 'borderTopLeftRadius', 35, 'red');
menu.createDial('#el-prop', 'knob2', 'borderTopRightRadius', 35, 'red');
menu.createDial('#el-prop', 'knob3', 'borderBottomLeftRadius', 35, 'red');
menu.createDial('#el-prop', 'knob4', 'borderBottomRightRadius', 35, 'red');
menu.newSection('menu-canvas', 'Canvas');
menu.addInput('text', 'arc', 'Brush Type', '', '', 'menu-textfield', 'can-brush-type', '#menu-canvas');
menu.addInput('number', '10', 'Brush Size', '0', '', 'menu-number', 'can-brush-size', '#menu-canvas');
menu.addInput('submit', 'Clear Canvas', '', '', '', 'menu-button', 'can-clear', '#menu-canvas');
menu.addInput('checkbox', '', '', '', '', 'menu-checkbox', 'painting', '.new-menu');
menu.addInput('checkbox', '', '', '', '', 'menu-checkbox', 'hOverflow', '.new-menu');
menu.addInput('submit', 'Textbox', '', '', '', 'menu-button', 'atextbox', '.new-menu');
//$('.new-menu select').clone().appendTo('.new-menu');
//$('.new-menu select')[0].remove();
//function Object (width, height, id, class, color, rotation, borderRadius, border, isCanvas) {
$('.minicolors').mousedown(function () {
    $('.new-menu').draggable();
    $('.new-menu').draggable('destroy');
});
$('.minicolors').mouseup(function () {
    $('.new-menu').draggable();
    $('.new-menu').draggable('enable');
});
$('.kn').mousedown(function () {
    $('.new-menu').draggable();
    $('.new-menu').draggable('destroy');
});
$('.kn').mouseup(function () {
    $('.new-menu').draggable();
    $('.new-menu').draggable('enable');
});

$('#element-name').on('keyup', function () {
    console.log(getSelected());
    getSelected().setName($(this).val());
    $('#selected').text($(this).val());
    getSelected().setAttr('title', $(this).val());
});
$('.menu-range').on('change', function () {
    var id = $(this).attr('id');

    getSelected().setBorderRadius([
    $('#borderTopLeftRadius').val() + '%',
    $('#borderTopRightRadius').val() + '%',
    $('#borderBottomLeftRadius').val() + '%',
    $('#borderBottomRightRadius').val() + '%']);
    console.log($(this));
});

$('#atextbox').on('click', function () {
    var div = $('<div class="drag-text">');
    var textbox = $('<textarea>');
    textbox.css({
        left: '0px',
        top: '0px',
        width: '90%',
        height: '95%',
        backgroundColor: 'transparent',
        border: 'none',
            'font-size': '100%',
            'z-index': '10000'
    });
    getSelected().getClass(false).append(div);
    div.append(textbox);
    div.draggable();
    div.resizable({
        resize: function (event, ui) {
            textbox.css('font-size', '100%');
        }
    });
});
//$(getSelected()).addEventListener('mousemove', function() {console.log('hi');}, false);

$('#can-clear').click(function () {
    getSelected().draw(0, 0, level, 'empty', 10000);
});



$.fn.changeVal = function (v) {
    return $(this).val(v).trigger("change");
}





var startA = 1;

$.fn.animateRotate = function (startAngle, endAngle, duration, easing, complete) {
    return this.each(function () {
        var elem = $(this);

        $({
            deg: startAngle
        }).animate({
            deg: endAngle
        }, {
            duration: duration,
            easing: easing,
            step: function (now) {
                elem.css({
                    '-moz-transform': 'rotate(' + now + 'deg)',
                        '-webkit-transform': 'rotate(' + now + 'deg)',
                        '-o-transform': 'rotate(' + now + 'deg)',
                        '-ms-transform': 'rotate(' + now + 'deg)',
                        'transform': 'rotate(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};




$('.minicolors').bind("contextmenu", function () {
    return false;
});

var selected = $(".content");
var debug = false;




//$('.demo').minicolors('rgbaString');

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//$("#content").draggable();
$(".console").draggable();
//$(".menu").draggable();


var ie = 0;
$("#clone").click(function () {
    ie++;
    var newObjects = new Element(250, 250, 'content' + ie, 'content' + ie, 'rgba(255, 0, 0, 1)', '0deg', [0, 0, 0, 0], 'none', false, true);

    // var newObject = getSelected().getClass().clone();
    console.log(newObjects);
    newObjects.getClass().css({
        left: '0px',
        top: '0px'
    });
    newObjects.init()
    //newObjects.getClass().draggable();
});


$("#delete").click(function () {
    getSelected().destroy();
});

$(".output").draggable();




$("#width").keyup(function () {
    getSelected().getClass().animate({
        width: $(this).val() + "px"
    });
});
$("#height").keyup(function () {
    getSelected().getClass().animate({
        height: $(this).val() + "px"
    });
});

$("#hidden").click(function () {
    $(selected).toggle();
});


var startA = 1;
$(".bRadius").on("change", function () {
    $(selected).animate({
        borderTopLeftRadius: $('#topLeft').val() + "%",
        borderTopRightRadius: $('#topRight').val() + "%",
        borderBottomLeftRadius: $('#bottomLeft').val() + "%",
        borderBottomRightRadius: $('#bottomRight').val() + "%"
    });
    $("#topLeftText").val($('#topLeft').val() + "%");
    $("#topRightText").val($('#topRight').val() + "%");
    $("#bottomLeftText").val($('#bottomLeft').val() + "%");
    $("#bottomRightText").val($('#bottomRight').val() + "%");
});
$("input").keyup(function () {
    console.log("1");
    var id = $(this).attr("id");
    if (id == "border-type") {
        var t = $("#border-type").attr("placeholder");
        $(selected).css(t, $(this).val());
    }
    if (id == "border-color") {
        $(selected).css({
            borderColor: $(this).val()
        });
    }
    if (id == "border-width") {
        $(selected).css({
            borderWidth: $(this).val()
        });
    }
    if (id == "border-style") {
        $(selected).css({
            borderStyle: $(this).val()
        });
    }
    if (id == "shadow") {
        $(selected).css({
            boxShadow: $(this).val()
        });
    }
    if (id == "name") {
        $(selected).attr("placeholder", $(this).val());
        $(selected).attr("title", $(this).val());
    }
    if (id == "pad") {
        $(selected).css({
            padding: $(this).val()
        });
    }
    if (id == "mar") {
        $(selected).css({
            margin: $(this).val()
        });
    }
    if (id == "red" || id == "green" || id == "blue") {

        $(this).css({
            backgroundColor: $(this).val()
        });
    }
    $(".css textarea").text("." + $("#class").val() + " " + ($("#id").val() !== "" ? "#" + $("#id").val() : "") + "{\nborder-top-left-radius:" + $("#topLeft").val() + ";\nborder-top-right-radius:" + $("#topRight").val() + ";\nborder-bottom-right-radius:" + $("#bottomRight").val() + ";\nborder-bottom-left-radius:" + $("#bottomLeft").val() + ";\n}");
    $(".html textarea").text("<div " + ($("#id").val() !== "" ? "id=\"" + $("#id").val() + "\"" : "") + " " + ($("#class").val() !== "" ? "class=\"" + $("#class").val() + "\"" : "") + "></div>");
});

$("#z-index").on("change", function () {
    $(selected).css("z-index", $(this).val());
    $("#zVal").val($(this).val());
});
$(".minimize").click(function () {
    $(".editor").toggle();
});
$(".borderSel").on("change", function () {
    if ($(this).val() == "border") {
        $("#border-type").attr("placeholder", "border");
        $("#border-type").val($(selected).css("border-" + $(this).val()));
    } else {
        $("#border-type").attr("placeholder", "border-" + $(this).val());
        $("#border-type").val($(selected).css("border-" + $(this).val()));
    }
    //
    //$("#zVal").val($(this).val());
});
$("input").keydown(function () {

    var id = $(this).attr("id");
});
  $(document).keydown(function(ev) {
                        altKey = ev.altKey;
      var key = ev.keyCode;
      if(key == 67) { //c
          getSelected().draw(0, 0, level, 'empty', 10000); 
      } else if (key == 78) { //n
          $('#clone').click();   
      } else if (key == 38) { //up
        
      }
                        console.log(ev.keyCode);
                    });
  $(document).keyup(function(ev) {
                        altKey = ev.altKey;
                        
                    });

var hideOverflow = false;
$('#hOverflow').on('change', function () {
    hideOverflow = !hideOverflow;
    getSelected().getClass(false).css('overflow', hideOverflow ? 'hidden' : '');
});

$('#painting').on('change', function () {
    //selected.attr('canPaint', (selected.attr('canPaint') == 'true') ? 'false' : 'true');
    console.log(getSelected());
    getSelected().togglePaint();
    if (getSelected().getPaintingAllowed()) {
        console.log(getSelected());
        getSelected().setDrag(false);
        //fillText(t, x, y);
        var con = getSelected().getContext();
        con.fillText($('.drag-text textarea').val(), $('.drag-text').css('left').replace('px', ''), $('.drag-text').css('top').replace('px', ''));
        $('.drag-text').remove();
        /*html2canvas($(".drag-text textarea"), {
            onrendered: function (canvas) {
                theCanvas = canvas;
                getSelected().getContext().putImageData(con, 0, 0);
                $('.drag-text').remove();
            }
        });*/
    } else {
        getSelected().setDrag(true);

    }

});