Frog Crosses Road
===============================

Author: Shuchen Liu

### Game Start
To play the game, open `index.html` with any modern browser, or visit [here](https://shuchenliu.github.io/FrogCrossesRoad). The game will automatically start.

### Introduction
The Game has:  

- Two different characters :
	1. **The player**, which can be controled.
	2. **Bugs** *a.k.a* enemies, which will be constantly generated and move at various speeds 
- Three sections:
	1. **the Lawn**, where player will be randomply respawned and bugs cannot move within.
	2. **the Road** or the Lanes, where bugs will move horizontally along the lane.
	3. **the Sea** or the finishing line, which player should aim to reach


### Controls
Use &larr;, &uarr;, &rarr; and &darr; on the keyboard to control the player and try to move the player across the road without being hit by any bugs.

### Game Logic:
- **Time Limit**: 15s  
	Each turn, player will have 15 seconds to move across the road.
- **Chances**: 3   
	Each turn, player coulde be hit by the bugs at most 3 times; After that game will stop.
- **Penalties**:  
	- *Hit by a bug*: Player's lives will be deducted by 1, and will be respawned to lawn.
	- *Retreat to lawn* : To avoid bugs, player may retreat to lawn. However, 1second will be consequently substracted from total available time.

