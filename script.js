let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    canvas: document.getElementById("gameCanvas"),
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload ()
{

}

function create ()
{

}

function update ()
{

}