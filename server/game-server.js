const util = require('./utils');
const config = require('../src/config.json');
const Matter = require('matter-js');
var NodeTree = require('./NodeTree');
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

/*
Data sent to screen:
    After round input:
        All the frames of the round
    What team won the game
    When game going

Data sent to phone
    At the beginning of game:
        team num
    On new round:
        round count

Data sent from phone:
    either
    fireInput: angle, magnitude 
    or
    moveInput: float

*/


module.exports = class GameServer {
    constructor(io) {
        this.roundCountdown = config.game.roundDurationSeconds;
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.users = [];
        this.userIds = 0;
        this.isActionRound = false;
        this.io = io;
        this.mapTree = new NodeTree(900, 900)
        
    }

    // GAME ROUND COUNTDOWN
    roundCountdownToZero() {
        console.log('Game timer zeroed out!');
        this.roundCountdown = 0;

    }

    startRoundCountdown = () => {
        this.isActionRound = true;
        this.io.emit('action round status', { actionRoundOn: true});
        this.roundCountdowns();
    }

    roundCountdowns = () => {
        setTimeout(() => {
            console.log('ran' + this.roundCountdown)
            if (this.roundCountdown > 0) {
                this.roundCountdown--;
                this.roundCountdowns();
                return;
            }
            // Reset countdown, stop accepting input
            this.roundCountdown = config.game.roundDurationSeconds;
            this.isActionRound = false;
            // Ask for playback to start
            this.runRound();
        }, 1000);

    }


    checkEndGame() {
        // Check if all players left are on the same team
        // or no players left
        
    }
    
    resetValuesOnNewGame() {
        // Reset every game variable for the new game
        this.roundCountDown = 0;
        this.isActionRound = false;
        this.roundCount = 0;
        this.terrainBoxes = [];
        this.bullets = [];
        this.roundCountdownToZero();
    }

    destroyPreviousGame() {
        
    }

    resetStart() {
        // Resets the game, but acts as the game starter...
        this.mapTree.generateTree();
        // Let's have it draw for now too...
        this.io.emit('initial game structure', { tree: this.mapTree.getTree()});
        // Has to run first
        this.resetValuesOnNewGame();
        this.generateTerrain();
        this.generatePlayers();

    }

    // User methods
    addUser(username, ) {
        this.users.push({
            username: username,
            userId: ++this.userIds,
            game: {
                moved: false,
                shot: false,
                gunAngle: 90,
                roundStartPosX: null
            },
        });
        // users = [{
        //     name: 'PETER',
        //     x: -170, y: -90,
        //     projectile: {
        //       x: -140, y:-120,
        //     },
        //   },{
        //     name: 'KRIS',
        //     x: 0, y:0,
        //     projectile: {
        //       x: -10, y:-80,
        //     },
        //   },{
        //     name: 'ARCHIE',
        //     x:30, y: 35,
        //   }];
        this.io.emit()
        return this.userIds;
    }

    removeUser(userId) {
        var idx = this.users.findIndex(d => d.userId === userId);
        if (idx >= 0) this.users.splice(idx, 1);
    }

    getUserList() {
        return this.users;
    }

    setUserRotation(username, rotation) {
        if (this.isActionRound) {
            let userToUpdate = this.users.find(user => user.username === username);
            if (userToUpdate) {
                if (!userToUpdate.hasOwnProperty('input')) {
                    userToUpdate.input = {};
                }
                userToUpdate.input.rotation = rotation;
            }
            console.log('Rotation input was accepted for' + username + " at an angle of " + rotation);
        }
        console.log(this.users);
    }

    setUserMagnitude(username, magnitude) {
        if (this.isActionRound) {
            let userToUpdate = this.users.find(user => user.username === username);
            if (userToUpdate) {
                if (!userToUpdate.hasOwnProperty('input')) {
                userToUpdate.input = {};
                }
                userToUpdate.input.magnitude = magnitude;
            }
            console.log('Magnitude input was accepted for' + username + " at a magnitude of " + magnitude);
        }
        console.log(this.users);
    }

    // ROUND CALCULATIONS & RUNNING
    runRound() {
        this.io.emit('action round status', { actionRoundOn: false});
        console.log('------users!-----')
        console.log(this.users)
        this.io.emit('action round results', { users: this.users });
        // Get calculations
    }

    
    generateTerrain() {
        // The map is `terrain.width` pixels wide and theoretically infinitely tall.
        // The map is divided into a grid of square cells that are `terrain.blockSize` pixels wide and tall.
        // Each cell is either ground or air.

        const {width, blockSize, minHeight, maxHeight} = config.game.terrain;
        const {maxHeightChange} = config.game.terrain.generation;

        let ground_cells = [];
        let current_height = config.game.terrain.generation.startHeight;
        for (let x = 0; x + blockSize <= width; x += blockSize) {
            // adjust current_height a bit
            // generate ground cells from the floor up to here and push into `ground_cells`.
            const delta_height = util.randomFloatBetween(-maxHeightChange, maxHeightChange);
            current_height = util.clamp(current_height + delta_height, minHeight, maxHeight);

            for (let y = 0; y + blockSize/2 < current_height; y += blockSize) {
                ground_cells.push({x:x, y:y});
            }
        }
        return ground_cells;
        // TODO: use this approach that makes straighter lines:
        // let terrain = config.game.terrain;
        // let generation = terrain.generation;
        // let indexGenerating = 0;
        // this.heights = [generation.startHeight];
        // // While we haven't gotten to the end of the terrain
        // while (indexGenerating < terrain.width) {
        //     let startHeight = this.heights[indexGenerating];
        //     let generateDistance = util.randomIntBetween(generation.minCalculateDistance, generation.maxCalculateDistance);
        //     let heightDistanceChange = util.randomIntBetween(-generation.maxHeightChange, generation.maxHeightChange);
        //     for (let i = 0; i < generateDistance; i++) {
        //         // Stop at end of terrain
        //         if (indexGenerating === terrain.max) break;
        //         indexGenerating++;
        //         let heightChange = (i / generateDistance) * heightDistanceChange;
        //         var height = util.clamp(generation.minHeight, generation.maxHeight, Math.floor(startHeight - heightChange));
        //         this.heights.push(height);
        //     }
        //     this.heights.push(terrain.minHeight);
        // }
        // // Use the heights to generate the terrain as a bunch of boxes
        // var heightIndex = 0;
        // this.terrainBoxes = [];
        // this.heights.forEach(h => {
        //     this.terrainBoxes.push([]);
        //     for(let i = 0; i < h; i++) {
        //         let height = i * terrain.blockSize;
        //         let width = heightIndex * terrain.blockSize;
        //         let terrainBlockBody = Bodies.rectangle(width, height, width, height, {isStatic: true});
        //         this.terrainBoxes[heightIndex].push(terrainBlockBody);
        //     }
        //     heightIndex++;
        // });
    }

    generatePlayers() {
        this.randomlyAssignTeams();
        // Make all of the bodys for each player and spawn them randomly on their side of the game
        let terrain = config.game.terrain;
        let player = config.game.player;
        let body = player.body;
        let realWidth = terrain.width * terrain.blockSize;
        let spawnY = terrain.maxHeight * terrain.blockSize + terrain.blockSize * 10;
        this.users.forEach(u => {
            let team = u.teamNumber;
            let spawnRandomInt = util.randomFloatBetween(player.spawnAwayFromEnd, realWidth - player.spawnAwayFromMid);
            let spawnX = (() => {
                if (team === 1) {
                    return spawnRandomInt;
                }
                if (team === 2) {
                    return realWidth - spawnRandomInt;
                }
                throw new Error("Cannot handle more than two teams"); 
            })();
            // spawn way above the ground. Simulation will have to happen to get them to touch the ground.
            // Todo. Make sure this doesn't not work
            u.box = Bodies.rectangle(spawnX, spawnY, body.width, body.height, {inertia: "Infinity"});
            World.add(this.world, u.box);
        });
    }

    randomlyAssignTeams() {
        // Randomly pick a user from the list
        // assign to team 1 then to alternating
        let teamNumber = 1;
        let usersToAssign = [...this.users];
        while (usersToAssign.length > 0) {
            var index = util.randomIntBetween(0, usersToAssign.length -1);
            let userAssigning = usersToAssign[index];
            // TODO make this actually assign it to the team number
            // THIS MIGHT NOT BE WORKING I'M PRETENDING STUFF EXISTS
            teamNumber = ((teamNumber + 1) % config.game.teams.numberOfTeams) + 1;
            userAssigning.teamNumber = teamNumber;
            userAssigning.splice(index, 1);
        }
    }

    roundAnimate() {
        // pretend like I have a bunch of input
        // calculate the game from the fake input
        let game = config.game;
        let player = game.player;
        this.users.forEach(u => {
            u.input = {
                rotation: util.randomFloatBetween(0, 360), 
                magnitude: util.randomFloatBetween(0, player.input.maxMagnitude),
                distance: util.randomFloatBetween(0, player.input.maxMovement),
            };
            u.game.roundStartPosX = u.box.position.x;
        });
        let updates = 0;
        while(true) {
            if (updates > game.maxUpdatePerRound) {
                break;
            }
            updates++;
            
            this.users.forEach(u => {
                let input = u.input;
                let movement = config.game.player.movement;
                // check distance movement done
                if (input.distance !== 0 && input.distance !== null) {
                    // Keep trying to move the player until the distance has been moved
                    let vel = movement.movementSpeed;
                    let playerX = u.box.position.x;
                    let goingToPlace = u.game.roundStartPosX + input.distance;
                    let move = () => {
                        u.box.applyForce(u.box, u.box.position, Matter.Vector(vel, 2));
                    };
                    if (input.distance > 0) {
                        if (playerX < goingToPlace) {
                            move();
                        }
                    } 
                    if (input.distance < 0) {
                        vel = -vel;
                        if (playerX > goingToPlace) {
                            move();
                        }
                    }
                }

                // check shoot input done
                if (input.angle !== null && input.magnitude !== null && !u.shot) {
                    // rotate until at the angle
                    // if (u.gunAngle !== input.angle) {
                    //     // Figure out if adding or subtracting would be faster for rotation
                    //     // https://stackoverflow.com/a/27682018/2948122
                    //     var gunRadeons = util.degreesToRadeons(u.gunAngle)
                    //     let inputRadeons = util.degreesToRadeons(input.angle);
                    //     // check if angle is close enough to snap
                    //     var snapAngle = () => {
                    //         if ()
                    //     }
                    //     if (Math.sin(gunRadeons - inputRadeons) > 0) {
                    //         u.gunAngle += movement.gunAngleSpeed;
                    //         u.gunAngle %= 360;
                    //     } else {
                    //         u.gunAngle -= movement.gunAngleSpeed;
                    //         u.gunAngle %= 360;
                    //     }
                    // }

                    // Instant shoot for now
                    u.gunAngle = input.angle;
                    let radius = player.bulletRadius;
                    let gunLength = player.body.gunLength
                    let position = u.box.position;
                    let x = Math.cos(util.degreesToRadeons(u.gunAngle)) * gunLength;
                    let y = Math.sin(util.degreesToRadeons(u.gunAngle)) * gunLength;
                    let bullet = Bodies.circle(position.x + x, position.y + y, radius);
                    // Generate bullet
                    World.add(this.world, bullet);
                    // Set the bullet velocity
                    this.bullets.push(bullet);
                    let xBull = Math.cos(util.degreesToRadeons(u.gunAngle)) * u.input.magnitude;
                    let yBull = Math.cos(util.degreesToRadeons(u.gunAngle)) * u.input.magnitude;
                    bullet.applyForce(bullet, bullet.position, Matter.Vector(xBull, yBull));
                    u.shot = true;
                }
                // Count down bullet max timer
                // If bullet collides with something divide timer by 2
                // If bullet hits user auto explode

                // Calculate next thingy
                Engine.update(this.engine, 1000/ game.updatesPerSecond);
            });
            // Once all player input has been done

        }
        this.finishRoundAnimate();
    }

    finishRoundAnimate = () => {
        // cleanse the input
        this.users.forEach(u => {
            u.input = {rotation: null, magnitude: null, distance: null};
        });
    }
}