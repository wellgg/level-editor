# level-editor
> A Simple Level Editor made with Electron.js and Node.js

## JSON Map Saving Format
```JavaScript
{
	// name of the map
	"name": "map-name",

	// player starting point
	"startpoint": [0, 0],

	// 2d array that stores the map
	"map": [ [ ], [ ], ...  [ ] ],

	// object that stores all entities
	"entities": {

		// array of enemies
		"enemies": [],

		// array of other npcs
		"npcs": []
	}

	// array of objects where player can teleport
	"telepoints": [ { }, { }, { } ]
}
```
This is how the Level Editor will save the level maps.