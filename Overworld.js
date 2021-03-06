class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const cameraPerson = this.map.gameObjects.hero;

            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            })

            this.map.drawLowerImage(this.ctx, cameraPerson);

            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            })

            this.map.drawUpperImage(this.ctx, cameraPerson);

            if(!this.map.isPaused){
                requestAnimationFrame(() => {
                    step();
                });    
            }
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //Is there a porson here to talk to?
            this.map.checkForActionCutscene();
        });
        new KeyPressListener("Escape", () => {
            if(!this.map.isCutscenePlaying) {
                this.map.startCutscene([
                    {type: "pause"}
                ]);
            }
        });
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                console.log("new hero position");
                //Hero's position has changed
                this.map.checkForFootstepCutscene();
            }
        });
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {
        this.hud = new Hud();
        this.hud.init(document.querySelector(".game-container"));

        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;
        this.startGameLoop();

        // this.map.startCutscene([
        //     {type: "battle", enemyId: "beth"}
        //     // {type: "changeMap", map: "DemoRoom"}
        // ]);
    }
}