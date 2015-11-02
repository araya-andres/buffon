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

function draw(width, height, floorboard, needles, hits, pi, error) {
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    floorboard.draw(ctx);
    needles.forEach(function (needle) { needle.draw(ctx); });
    $('#throws_value').text(needles.length);
    $('#hits').text(hits);
    $('#pi').text(pi);
    $('#error').text(error + '%');
}

var run = function () {
    var width = height = 600;
    var floorboard = new Floorboard(width / 3, 0, width / 3, height);
    var numberOfThrows = parseInt($('#throws').val());
    var needle, needles = [], needleLength = floorboard.width / 3;
    var hits = 0, pi, error, i;

    for (i = 0; i < numberOfThrows; ++i) {
        needle = new Needle(new Point(getRandomInt(floorboard.x, floorboard.x + floorboard.width),
                                      getRandomInt(0, floorboard.height)),
                            getRandomInt(-90, 90),
                            needleLength);
        if (!needle.inside(floorboard)) hits++;
        needles.push(needle);
    }
    pi = 2 * needleLength * numberOfThrows / (floorboard.width * hits);
    error = 100 * (pi - Math.PI) / Math.PI;
    draw(width, height, floorboard, needles, hits, pi, error);
}

$(document).ready(function () {
    $('#throws').click(run);
    $('#throw_button').click(run);
    run();
});
