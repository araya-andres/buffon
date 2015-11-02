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

function Buffon(floorboard) {
    this.floorboard = floorboard;
    this.numberOfThrows = 1000;
    this.needles = [];
    this.hits = 0;
    this.pi = 0.0;
    this.error = 0.0;
}

Buffon.prototype.calc = function () {
    var needleLength = this.floorboard.width / 3, needle, i;
    var floorboard = this.floorboard;
    this.needles = [];
    this.hits = 0;
    for (i = 0; i < this.numberOfThrows; ++i) {
        needle = new Needle(new Point(getRandomInt(floorboard.x, floorboard.x + floorboard.width),
                                      getRandomInt(0, floorboard.height)),
                            getRandomInt(-90, 90),
                            needleLength);
        if (!needle.inside(floorboard)) this.hits++;
        this.needles.push(needle);
    }
    this.pi = 2 * needleLength * this.numberOfThrows / (floorboard.width * this.hits);
    this.error = 100 * (this.pi - Math.PI) / Math.PI;
}

function UI(canvas, numberOfThrows, hits, pi, error) {
    this.canvas = canvas;
    this.numberOfThrows = numberOfThrows;
    this.hits = hits;
    this.pi = pi;
    this.error = error;
}

UI.prototype.draw = function (buffon) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.numberOfThrows.text(buffon.numberOfThrows);
    this.hits.text(buffon.hits);
    this.pi.text(buffon.pi);
    this.error.text(buffon.error);
    buffon.floorboard.draw(ctx);
    buffon.needles.forEach(function (needle) { needle.draw(ctx); });
}

$(document).ready(function () {
    var canvas, ui, buffon, callback;
    canvas = $('#canvas')[0];
    canvas.width = canvas.height = 600;
    ui = new UI(canvas, $('#throws_value'), $('#hits'), $('#pi'), $('#error'));
    buffon = new Buffon(new Floorboard(canvas.width / 3, 0, canvas.width / 3, canvas.height));
    callback = function () {
        buffon.numberOfThrows = parseInt($('#throws').val());
        buffon.calc();
        ui.draw(buffon);
    };
    $('#throws').click(callback);
    $('#throw_button').click(callback);
    callback();
});
