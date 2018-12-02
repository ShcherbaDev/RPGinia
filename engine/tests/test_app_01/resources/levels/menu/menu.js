function controller(worldClass) {
    // console.log(this)
    // let colors = [
    //     "red",
    //     "blue",
    //     "green",
    //     "grey",
    //     "yellow"
    // ];
    setTimeout(() => {
        // this.data.settings.background = colors[Math.floor(Math.random() * colors.length)];
        worldClass.level = "Last corridor";
    }, 1000)
}