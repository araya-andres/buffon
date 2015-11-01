function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function radians(degrees)
{
    return degrees * Math.PI / 180;
}

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Point.prototype.getPointAt = function(distance, angle)
{
    var alpha = radians(angle);
    return new Point(
        this.x + distance * Math.cos(alpha),
        this.y - distance * Math.sin(alpha));
}

function Floorboard(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Floorboard.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
}

Floorboard.prototype.contain = function(p) {
    return this.x < p.x && p.x < (this.x + this.width);
}

function Needle(center, alpha, length) {
    this.center = center || new Point(0, 0);
    this.alpha = alpha || 0;
    this.length = length || 1;
}

Needle.prototype.getP1 = function () {
    return this.center.getPointAt(-this.length / 2, this.alpha);
}

Needle.prototype.getP2 = function () {
    return this.center.getPointAt(this.length / 2, this.alpha);
}

Needle.prototype.draw = function(ctx) {
    var p1 = this.getP1(),
        p2 = this.getP2();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

Needle.prototype.inside = function(floorboard) {
    return floorboard.contain(this.getP1()) && floorboard.contain(this.getP2());
}

function throwNeedles(numberOfThrows) {
    const WIDTH = 300, HEIGHT = 300;
    var numberOfThrows = numberOfThrows || 100;
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var floorboard = new Floorboard(WIDTH / 3, 0, WIDTH / 3, HEIGHT);
    var needle;
    var needleLength = floorboard.width / 3;
    var hits = 0, pi;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    floorboard.draw(ctx);
    for (i = 0; i < numberOfThrows; ++i) {
        needle = new Needle(new Point(getRandomInt(floorboard.x, floorboard.x + floorboard.width),
                                      getRandomInt(0, floorboard.height)),
        getRandomInt(-90, 90),
        needleLength);
        needle.draw(ctx);
        if (!needle.inside(floorboard)) {
            hits++;
        }
    }
    pi = 2 * needleLength * numberOfThrows / (floorboard.width * hits);
    $('#throws_value').text(numberOfThrows);
    $('#hits').text(hits);
    $('#pi').text(pi);
    $('#error').text((100 * (pi - Math.PI) / Math.PI) + '%');
}

var run = function ()
{
    var n = $('#throws').val();
    var hits = throwNeedles(parseInt(n));
}

$(document).ready(function () {
    $('#throws').click(run);
    run();
});
