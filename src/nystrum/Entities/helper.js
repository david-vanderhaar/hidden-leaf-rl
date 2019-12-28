import * as Helper from '../../helper';

export const destroyEntity = (entity) => {
  entity.energy = 0;
  let tile = entity.game.map[Helper.coordsToString(entity.pos)];
  entity.game.map[Helper.coordsToString(entity.pos)].entities = tile.entities.filter((e) => e.id !== entity.id);
  entity.game.engine.actors = entity.game.engine.actors.filter((e) => e.id !== entity.id);
  entity.game.engine.removeStatusEffectByActorId(entity.id);
  entity.game.draw()
  entity.game.engine.currentActor = entity.game.engine.currentActor % entity.game.engine.actors.length; 

}