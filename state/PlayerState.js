class PlayerState {
    constructor() {
        this.pizzas = {
            "p1": {
                pizzaId: "s001",
                hp: 30,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: {type: "saucy"},
            }
        }
    }  
}
window.playerState = new PlayerState();