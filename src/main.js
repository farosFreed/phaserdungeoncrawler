import React from "react";
//import { useStoreon } from "storeon/react";
//import { STATUSES } from "lib/game";

import CommandBar from './components/ui/CommandBar';

//import { Controls as BattleControls } from "components/battle";
//import { View } from "components/views";
//import { Controls as IdleControls } from "./components/controls";

function Main() {
  /*
  const {
    gameState: { status },
    ui: { view },
  } = useStoreon("gameState", "ui");
  */

  const isInFightMode = status === STATUSES.FIGHTING;

  //const Controls = IdleControls;
  //const Controls = isInFightMode ? BattleControls : IdleControls;

  return (
    <>
      {(view && !isInFightMode) && <View />}
      <CommandBar>
       {/* <Controls /> */}
      </CommandBar>
    </>
  );
}

export default Main;