const util = require('./utils');
const config = require('../src/config.json');
const Matter = require('matter-js');

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
    constructor() {
        this.roundCountdown = config.game.roundDurationSeconds;
        this.engine = Engine.create();
        this.world = engine.world;
    }

    // GAME ROUND COUNTDOWN
    roundCountdownToZero() {
        console.log('Game timer zeroed out!');
        this.roundCountdown = 0;

    }

    startRoundCountdown = () => {
            setTimeout(() => {
                console.log('ran' + this.roundCountdown)
                if (this.roundCountdown > 0) {
                    this.roundCountdown--;
                    this.startRoundCountdown();
                    return;
                }
                // Reset countdown
                this.roundCountdown = config.game.roundDurationSeconds;
                // Ask for playback to start
                this.runRound();
            }, 1000);
    }

    getTick() {
        return this.roundCountdown;
    }

    checkEndGame() {
        // Check if all players left are on the same team
        // or no players left
        
    }
    
    resetValuesOnNewGame() {
        // Reset every game variable for the new game
        this.timer = 0;
        this.roundCount = 0;
        this.terrainBoxes = [];
        this.roundCountdownToZero();
    }

    destroyPreviousGame() {
        
    }

    resetStart() {
        // Resets the game, but acts as the game starter...

        // Has to run first
        this.resetValuesOnNewGame();
        // this.generateTerrain();
        // this.generatePlayers();

    }

    // ROUND CALCULATIONS & RUNNING
    runRound() {
        //meh
    }

    
    generateTerrain() {
        // Make the terrain
        // Calculate the terrain 
        let terrain = config.game.terrain;
        let generation = terrain.generation;
        let indexGenerating = 0;
        this.heights = [generation.startHeight];
        // While we haven't gotten to the end of the terrain
        while (indexGenerating < terrain.width) {
            let startHeight = this.heights[indexGenerating];
            let generateDistance = util.randomIntBetween(generation.minCalculateDistance, generation.maxCalculateDistance);
            let heightChange = util.randomIntBetween(-generation.maxHeightChange, generation.maxHeightChange);
            for (let i = 0; i < generateDistance; i++) {
                // Stop at end of terrain
                if (indexGenerating == terrain.max) break;
                let heightChange = (i / generateDistance) * heightChange;
                var height = util.between(generation.minHeight, generation.maxHeight, Math.floor(startHeight - heightChange));
                this.heights.push(height);
            }
            heights.push(terrain.minHeight);
        }
        // Use the heights to generate the terrain as a bunch of boxes
        var heightIndex = 0;
        this.heights.forEach(h => {
            this.terrainBoxes.push([]);
            for(let i = 0; i < h; i++) {
                let height = i * terrain.blockSize;
                let width = heightIndex * terrain.blockSize;
                let terrainBlockBody = Bodies.rectangle(width, height, width, height, {isStatic: true});
                World.add(this.world, terrainBlockBody);
                this.terrainBoxes[heightIndex].push(terrainBlockBody);
            }
            heightIndex++;
        });
    }

    generatePlayers() {
        this.randomlyAssignTeam();
        // Make all of the bodys for each player and spawn them randomly on their side of the game
        let terrain = config.game.terrain;
        let player = config.game.player;
        let body = player.body;
        let realWidth = terrain.width * terrain.blockSize;
        let spawnY = terrain.maxHeight * t + terrain.blockSize * 10;
        this.users.forEach(u => {
            team = u.teamNumber;
            spawnRandomInt = util.randomFloatBetween(player.spawnAwayFromEnd, realWidth - player.spawnAwayFromMid);
            spawnX = (() => {
                if (team == 1) {
                    return spawnRandomInt;
                }
                if (team == 2) {
                    return realWidth - spawnRandomInt;
                }
                throw "Cannot handle more than two teams"; 
            })();
            // spawn way above the ground. Simulation will have to happen to get them to touch the ground.
            user.box = Bodies.rectangle(spawnX, spawnY, body.width, body.height, {inertia: "Infinity"});
            World.add(this.world, user.box);
        });
    }

    randomlyAssignTeam() {
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
            array.splice(index, 1);
        }
    }

    roundAnimate() {
        // 

    }
}