/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    // Game Logic Variables
    let life = 3;
    let beingPunished = false;
    let gameEnd = false;

    // Timer feature
    const timeLimit = 1500;

    let timerHandle = 0;
    let timeLeft = timeLimit;
    let nowLimit = timeLimit;
    const timer = doc.createElement('span');
    timer.classList.add('time_holder');
    timer.innerHTML = 'Time Left: '
    let timeRead = doc.createElement('span');
    timer.appendChild(timeRead);

    // Main canvas
    canvas.width = 505;
    canvas.height = 606;

    const container = document.getElementsByClassName('container')[0];
    console.log(container);
    container.children[1].appendChild(timer);
    container.appendChild(canvas);
    doc.body.appendChild(container);


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        life = 3;
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
      if (!gameEnd) {
        updateEntities(dt);
        checkSea();
        checkCollisions();
        checkOnLawn();
        checkOnRoad();
        gameChecker();
      }
    }

    // check if player is on the lawn

    const checkOnLawn = () => {
      if (player.y > 220 && timerHandle != 0) {
        // going back to lawn will be pushished by substracting 3 seconds from the count-down
        beingPunished = true;
        resetTimer(100);
      }
    }

    // check if player is on the road and make sure the timer is ticking

    const checkOnRoad = () => {
      if (player.y >= 60 && player.y <= 220 && timerHandle == 0) {
        setTimer();
      }
    }

    // check if the player had reached into the sea...
    const checkSea = () => {
        if (player.y < 60) {
          endGame(true);
        }
    }


    // check for game-end and update game panel
    const gameChecker = () => {

      //update timer
      const timeSpan = doc.getElementsByClassName('time_holder')[0].children[0];
      timeSpan.innerHTML = (timeLeft / 100).toFixed(2);
      if (beingPunished) {
        timeSpan.innerHTML += ' -1s!!'
      }

      //update life indicator
      const hearts = doc.getElementsByClassName('hearts')[0];
      for (let i = 0; i < life; ++i) {
        const heart = hearts.children[i].children[0];
        if (heart.classList.contains('fa-heart-o')) {
          heart.classList.remove('fa-heart-o');
        }

        if (!heart.classList.contains('fa-heart')) {
          heart.classList.add('fa-heart');
        }
      }

      for (let i = life; i < 3; ++i) {
        const heart = hearts.children[i].children[0];

        if (heart.classList.contains('fa-heart')) {
          heart.classList.remove('fa-heart');
        }

        if (!heart.classList.contains('fa-heart-o')) {
          heart.classList.add('fa-heart-o');
        }
      }

      // end Game
      if (timeLeft === 0 || life === 0) {
          endGame(false);
      }
    }

    // run const check on each enemy see if it has collides with player
    const checkCollisions = () => {
      for (let i = 0; i < allEnemies.length; ++i) {
        const enemy = allEnemies[i];
        if (playerHitBy(enemy)) {
          life--;
          reset();
          break;
        }
      }
    };

    const playerHitBy = enemy => {
      if (enemy.y === player.y) {
          if (player.x + 30 < enemy.x) {
            return false;
          } else {
            return player.x < enemy.x + 80;
          }
      } else {
        return false;
      }
    }
    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        /*
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        */

        // new way to loop with garbage collection
        const length = allEnemies.length;
        for (let i = 0; i < length; ++i) {
          let enemy = allEnemies.shift();

          if (enemy.x < 500) {
            // if it is still within the frame, we render it
            // and push it back to allEnemies for next check
            enemy.render();
            allEnemies.push(enemy);
          }
        }
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        console.log("respawned!");
        // reset timer
        resetTimer(timeLimit);
        player.respawn();
    }

    // in the event that player wins, endGame() will be called
    // to show pop-up according to the result
    const endGame = result => {
      gameEnd = true;
      allEnemies = [];
      console.log("handle cleared: " + enemyHandle);
      clearInterval(enemyHandle);
      //customize end game pop-up
      let iconClass, title, message;

      switch (result) {
        case false:
          life = 3;
          iconClass = 'fa-close';
          title = 'Uh-oh';
          message = `You failed to reached to sea within ${timeLimit / 100} seconds using 3 lives`;
          break;
        case true:
          iconClass = 'fa-check';
          title = 'Congratulations'
          message = `You reached the sea in ${(timeLimit - timeLeft) / 100} seconds with ${life} lives left!`
          break;
      }

      reset();


      // pop up make up
      doc.getElementsByClassName('container')[0].classList.add('blur');
      const popup = doc.getElementsByClassName('pop-up')[0];
      // icon
      const icon = popup.getElementsByClassName('popup-icon')[0].children[0];
      icon.classList.remove('fa-close');
      icon.classList.remove('fa-check');
      icon.classList.add(iconClass);

      // title and text
      const poptitle = popup.getElementsByClassName('popup-title')[0];
      poptitle.innerHTML = title;
      const text = popup.getElementsByClassName('popup-content')[0];
      text.innerHTML = message;

      // button
      const overlay = doc.getElementsByClassName('overlay')[0];

      const hideOverlay = () => {
        overlay.style.visibility = 'hidden';
        document.getElementsByClassName('container')[0].classList.remove('blur');
      }

      const button = document.getElementsByClassName('popup-button')[0];
      button.addEventListener('click', (e) => {
        if (gameEnd) {
          e.preventDefault();
          hideOverlay();
          newGame();
        }
      });

      // show the overlay
      setTimeout(() => {
        overlay.style.visibility = 'visible';
      },550);
    }

    // new game
    const newGame = () => {
      gameEnd = false;
      allEnemies = [];
      clearInterval(enemyHandle);
      setEnemies();
      init();
    }

    // function that resets timer
    const resetTimer = num => {
      clearInterval(timerHandle);
      timerHandle = 0;
      if (num === timeLimit) {
        timeLeft = timeLimit;
      } else {
          if (timeLeft - num < 0) {
            timeLeft = 0;
          } else {
            nowLimit = timeLeft - num;
          }
      }
    }

    // function that starts timer
    const setTimer = () => {
      beingPunished = false;
      timeLeft = nowLimit;
      nowLimit = timeLimit;
      timerHandle = setInterval(() => {
        timeLeft -= 1;
      },10);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
