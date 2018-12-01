function controller(worldClass) {
    let colors = [
        "red",
        "blue",
        "green",
        "grey",
        "yellow"
    ];
    setInterval(() => {
        this.data.settings.background = colors[Math.floor(Math.random() * colors.length)];
        // worldClass.level = "Last corridor";
    }, 500)
}