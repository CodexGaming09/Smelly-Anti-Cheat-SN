import {
  world,
  BlockLocation,
  EntityQueryOptions,
  Entity,
  Location,
  ItemStack,
  Player,
} from "mojang-minecraft";
import { SHAPES } from "../../../plugins/World Edit/modules/definitions/shapes.js";
import * as SA from "../../index.js";

export class EntityBuilder {
  /**
   * Get entitie(s) at a position
   * @param {number} x X position of the entity
   * @param {number} y Y position of the entity
   * @param {number} z Z position of the entity
   * @param {String} dimension Dimesion of the entity
   * @returns {Entity}
   * @example EntityBuilder.getEntityAtPos(0, 5, 0, { dimension: 'nether', ignoreType: ['minecraft:player']});
   */
  getAtPos(x, y, z, dimension = "overworld") {
    try {
      return world
        .getDimension(dimension)
        .getEntitiesAtBlockLocation(new BlockLocation(x, y, z));
    } catch (error) {
      return [];
    }
  }
  /**
   * Returns a location of the inputed aguments
   * @param {Entity} entity your using
   * @param {number} n how many you want to get
   * @param {number} maxDistance max distance away
   * @param {String} type type of entity you want to get
   * @returns {Array<Entity>}
   * @example getClosetsEntitys(Entity, n=1, maxDistance = 10, type = Entity.type)
   */
  getClosetsEntitys(entity, maxDistance = null, type = false, n = 2) {
    let q = new EntityQueryOptions();
    q.location = entity.location;
    if (n) q.closest = n;
    if (type) q.type = type;
    if (maxDistance) q.maxDistance = maxDistance;
    let entitys = [...world.getDimension("overworld").getEntities(q)];
    entitys.shift();
    return entitys;
  }
  /**
   * Returns a location of the inputed aguments
   * @param {Entity} entity your using
   * @param {number} value what you want to search for
   * @example getTagStartsWith(Entity, 2)
   */
  getTagStartsWith(entity, value) {
    const tags = entity.getTags();
    if (tags.length === 0) return null;
    const tag = tags.find((tag) => tag.startsWith(value));
    if (!tag) return null;
    if (tag.length < value.length) return null;
    return tag.substring(value.length);
  }
  /**
   * Get score of an entity
   * @param {Entity} entity you want to test
   * @param {string} objective Objective name you want to search
   * @returns {number} 0
   * @example getScore(Entity, 'Money');
   */
  getScore(entity, objective) {
    try {
      const command = entity.runCommand(
        `scoreboard players test @s "${objective}" * *`
      );
      return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
    } catch (error) {
      return 0;
    }
  }
  /**
   * Gets the entitys dimension
   * @param {Entity} entity entity you want to search
   * @returns "overworld" | "the end" | "nether"
   * @example getDimension('Smell of curry');
   */
  getDimension(entity) {
    for (const dimension of ["overworld", "nether", "the end"]) {
      if (entity.dimension == world.getDimension(dimension)) return dimension;
    }
    return "overworld";
  }
  /**
   * Tests if a entity is dead
   * @param {Entity} entity entity you want to test
   * @returns {Boolean}
   * @example isDead(Entity);
   */
  isDead(entity) {
    return (
      entity.hasComponent("minecraft:health") &&
      entity.getComponent("minecraft:health").current <= 0
    );
  }
  /**
   * Gets the name of a entity after : in id
   * @param {String} entityName entity you want to test
   * @returns {String}
   * @example getGenericName(Entity);
   */
  getGenericName(entityName) {
    return entityName.split(":")[1];
  }
  /**
   * Gets the inventory of a entity
   * @param {Entity} entity entity you want to get
   * @returns {Array<ItemStack>}
   * @example getGenericName(Entity);
   */
  getInventory(entity) {
    const inventory = entity.getComponent("minecraft:inventory").container;
    let items = [];
    for (let i = 0; i < inventory.size; i++) {
      items.push(
        inventory.getItem(i) ?? { id: "minecraft:air", amount: 0, data: 0 }
      );
    }
    return items;
  }
  /**
   * Gets a players held item
   * @param {Player} player player you want to get
   * @returns {ItemStack}
   * @example getHeldItem(Player);
   */
  getHeldItem(player) {
    const inventory = player.getComponent("minecraft:inventory").container;
    return inventory.getItem(player.selectedSlot);
  }
  /**
   * Gets the inventory of a entity
   * @param {Entity} entity entity you want to get
   * @param {ItemStack} item item you want to add
   * @returns {void}
   * @example giveItem(Entity, itemstack);
   */
  giveItem(entity, item) {
    const inventory = entity.getComponent("minecraft:inventory").container;
    inventory.addItem(item);
  }
  /**
   * Get the current chunk of a entity
   * @param {Entity} entity entity to check
   * @returns {Object}
   * @example getCurrentChunk(Entity);
   */
  getCurrentChunk(entity) {
    return {
      x: Math.floor(entity.location.x / 16),
      z: Math.floor(entity.location.z / 16),
    };
  }
  /**
   * Gets the cuboid positions of a entitys chunk
   * @param {Entity} entity entity to check
   * @returns {Object}
   * @example getChunkCuboidPositions(Entity);
   */
  getChunkCuboidPositions(entity) {
    const chunk = this.getCurrentChunk(entity);
    const pos1 = new BlockLocation(chunk.x * 16, -63, chunk.z * 16);
    const pos2 = pos1.offset(16, 383, 16);
    return {
      pos1: pos1,
      pos2: pos2,
    };
  }

  getChunkBorderOutline(entity) {
    const { pos1, pos2 } = this.getChunkCuboidPositions(entity);
    const values = {
      xmin: Math.min(pos1.x, pos2.x),
      xmax: Math.max(pos1.x, pos2.x),
      ymin: Math.min(pos1.y, pos2.y),
      ymax: Math.max(pos1.y, pos2.y),
      zmin: Math.min(pos1.z, pos2.z),
      zmax: Math.max(pos1.z, pos2.z),
      get rada() {
        return (this.xmax - this.xmin) / 2;
      },
      get radb() {
        return (this.ymax - this.ymin) / 2;
      },
      get radc() {
        return (this.zmax - this.zmin) / 2;
      },
      get cx() {
        return (this.xmax + this.xmin) / 2;
      },
      get cy() {
        return (this.ymax + this.ymin) / 2;
      },
      get cz() {
        return (this.zmax + this.zmin) / 2;
      },
    };
    const condition = new Function(
      "x, y, z, {xmin, xmax, ymin, ymax, zmin, zmax, cx, cy, cz}, rad",
      `return ${SHAPES.border_line}`
    );
    const locations = [];
    for (let x = values.xmin - values.cx; x <= values.xmax - values.cx; x++) {
      for (let y = values.ymin - values.cy; y <= values.ymax - values.cy; y++) {
        for (
          let z = values.zmin - values.cz;
          z <= values.zmax - values.cz;
          z++
        ) {
          if (!condition(x, y, z, values, 8)) continue;
          let X = values.cx + x;
          let Y = values.cy + y;
          let Z = values.cz + z;
          locations.push(new BlockLocation(X, Y, Z));
        }
      }
    }
    return locations;
  }
}
export const EntityBuild = new EntityBuilder();
