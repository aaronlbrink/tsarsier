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
    }

    getRoundCount() {
        return this.roundCount;
    }

    checkEndGame() {
        // Check if all players left are on the same team
        // or no players left
        
    }
    
    resetValuesOnNewGame() {
        this.roundCount = 0;
    }

    destroyPreviousGame() {
        
    }

    resetStart() {
        // Resets the game, but acts as the game starter...

        // Has to run first
        this.destroyPreviousGame();

        this.resetValuesOnNewGame();
        this.generateTerrain();
        this.generatePlayers();
    }
    
    generateTerrain() {
        // Make the terrain
        // Calculate the terrain 
        let terrain = config.game.terrain;
        let generation = terrain.generation;
        var indexGenerating = 0;
        this.heights = [];
        while (indexGenerating < terrain.width/2) {
            heights.push(terrain.minHeight);
        }
        // While we haven't gotten to the end of the terrain

    }

    generatePlayers() {
        this.randomlyAssignTeam();
        // Make all of the bodys for each player and spawn them randomly on their side of the game
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
            
            array.splice(index, 1);
            teamNumber = ((teamNumber + 1) % config.game.teams.numberOfTeams) + 1;
        }
    }

    roundAnimate() {
        // 
    }

}