import { SA } from "../../../index.js";
import { PlayerLog } from "../utils/PlayerLog.js";
import { forEachValidPlayer } from "../utils/Players.js";
import { PreviousLocation as PrevLo } from "../utils/PreviousLocation.js";

/**
 * Minecraft Bedrock Anti Phase
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti phase system. It works by getting the block the player is in
 * every tick. If the block there in is a FULL_BLOCK it will tp the player to
 * there last position where they wernt in one of those blocks
 * --------------------------------------------------------------------------
 */

/**
 * Stores Last Previous grounded location
 */
const log = new PlayerLog();

/**
 * List of blocks that are full, there unit_cubed
 */
export const FULL_BLOCKS = [
  "minecraft:polished_basalt",
  "minecraft:blackstone_double_slab",
  "minecraft:element_118",
  "minecraft:target",
  "minecraft:amethyst_block",
  "minecraft:gold_ore",
  "minecraft:element_93",
  "minecraft:blue_glazed_terracotta",
  "minecraft:nether_gold_ore",
  "minecraft:element_25",
  "minecraft:element_5",
  "minecraft:double_stone_slab4",
  "minecraft:red_mushroom_block",
  "minecraft:moss_block",
  "minecraft:element_98",
  "minecraft:red_nether_brick",
  "minecraft:waxed_copper",
  "minecraft:deepslate_tile_double_slab",
  "minecraft:tuff",
  "minecraft:calcite",
  "minecraft:deepslate_copper_ore",
  "minecraft:diamond_ore",
  "minecraft:waxed_oxidized_cut_copper",
  "minecraft:element_73",
  "minecraft:concrete",
  "minecraft:copper_ore",
  "minecraft:element_102",
  "minecraft:element_16",
  "minecraft:waxed_exposed_copper",
  "minecraft:loom",
  "minecraft:info_update2",
  "minecraft:dripstone_block",
  "minecraft:carved_pumpkin",
  "minecraft:honeycomb_block",
  "minecraft:beacon",
  "minecraft:mud_brick_double_slab",
  "minecraft:stripped_dark_oak_log",
  "minecraft:crimson_hyphae",
  "minecraft:end_bricks",
  "minecraft:command_block",
  "minecraft:lime_glazed_terracotta",
  "minecraft:pearlescent_froglight",
  "minecraft:quartz_ore",
  "minecraft:info_update",
  "minecraft:barrel",
  "minecraft:big_dripleaf",
  "minecraft:element_68",
  "minecraft:redstone_lamp",
  "minecraft:mossy_cobblestone",
  "minecraft:element_113",
  "minecraft:stripped_crimson_hyphae",
  "minecraft:deepslate",
  "minecraft:diamond_block",
  "minecraft:packed_ice",
  "minecraft:oxidized_cut_copper",
  "minecraft:element_39",
  "minecraft:packed_mud",
  "minecraft:element_21",
  "minecraft:element_1",
  "minecraft:blue_ice",
  "minecraft:stripped_oak_log",
  "minecraft:gold_block",
  "minecraft:element_18",
  "minecraft:podzol",
  "minecraft:noteblock",
  "minecraft:element_11",
  "minecraft:lit_blast_furnace",
  "minecraft:raw_gold_block",
  "minecraft:melon_block",
  "minecraft:weathered_double_cut_copper_slab",
  "minecraft:mob_spawner",
  "minecraft:deepslate_tiles",
  "minecraft:obsidian",
  "minecraft:glowingobsidian",
  "minecraft:oxidized_double_cut_copper_slab",
  "minecraft:polished_blackstone_double_slab",
  "minecraft:exposed_copper",
  "minecraft:polished_deepslate_double_slab",
  "minecraft:element_89",
  "minecraft:sponge",
  "minecraft:exposed_double_cut_copper_slab",
  "minecraft:bone_block",
  "minecraft:smoker",
  "minecraft:hardened_clay",
  "minecraft:stripped_jungle_log",
  "minecraft:stone",
  "minecraft:polished_blackstone_brick_double_slab",
  "minecraft:warped_wart_block",
  "minecraft:crimson_double_slab",
  "minecraft:respawn_anchor",
  "minecraft:element_43",
  "minecraft:hay_block",
  "minecraft:waxed_weathered_copper",
  "minecraft:honey_block",
  "minecraft:lit_pumpkin",
  "minecraft:yellow_glazed_terracotta",
  "minecraft:smooth_basalt",
  "minecraft:stonecutter",
  "minecraft:warped_stem",
  "minecraft:netherrack",
  "minecraft:warped_planks",
  "minecraft:element_107",
  "minecraft:verdant_froglight",
  "minecraft:magenta_glazed_terracotta",
  "minecraft:stripped_spruce_log",
  "minecraft:element_82",
  "minecraft:infested_deepslate",
  "minecraft:orange_glazed_terracotta",
  "minecraft:emerald_block",
  "minecraft:element_116",
  "minecraft:deepslate_brick_double_slab",
  "minecraft:wool",
  "minecraft:wood",
  "minecraft:warped_hyphae",
  "minecraft:element_41",
  "minecraft:ochre_froglight",
  "minecraft:brown_glazed_terracotta",
  "minecraft:pink_glazed_terracotta",
  "minecraft:quartz_block",
  "minecraft:silver_glazed_terracotta",
  "minecraft:oxidized_copper",
  "minecraft:element_19",
  "minecraft:sculk_catalyst",
  "minecraft:element_115",
  "minecraft:cobblestone",
  "minecraft:repeating_command_block",
  "minecraft:double_wooden_slab",
  "minecraft:stripped_warped_stem",
  "minecraft:daylight_detector",
  "minecraft:double_cut_copper_slab",
  "minecraft:sandstone",
  "minecraft:crimson_planks",
  "minecraft:polished_blackstone",
  "minecraft:mycelium",
  "minecraft:element_72",
  "minecraft:element_52",
  "minecraft:smithing_table",
  "minecraft:bedrock",
  "minecraft:stonebrick",
  "minecraft:netherite_block",
  "minecraft:redstone_block",
  "minecraft:redstone_wire",
  "minecraft:waxed_exposed_cut_copper",
  "minecraft:log2",
  "minecraft:end_stone",
  "minecraft:deny",
  "minecraft:waxed_oxidized_copper",
  "minecraft:cracked_deepslate_tiles",
  "minecraft:element_67",
  "minecraft:element_66",
  "minecraft:budding_amethyst",
  "minecraft:monster_egg",
  "minecraft:red_glazed_terracotta",
  "minecraft:crafting_table",
  "minecraft:crimson_nylium",
  "minecraft:warped_double_slab",
  "minecraft:coal_ore",
  "minecraft:snow",
  "minecraft:ancient_debris",
  "minecraft:slime",
  "minecraft:element_117",
  "minecraft:lapis_block",
  "minecraft:client_request_placeholder_block",
  "minecraft:redstone_ore",
  "minecraft:nether_wart_block",
  "minecraft:light_blue_glazed_terracotta",
  "minecraft:element_84",
  "minecraft:element_79",
  "minecraft:basalt",
  "minecraft:element_44",
  "minecraft:waxed_double_cut_copper_slab",
  "minecraft:lit_redstone_lamp",
  "minecraft:element_85",
  "minecraft:element_97",
  "minecraft:element_111",
  "minecraft:cracked_nether_bricks",
  "minecraft:pumpkin",
  "minecraft:smooth_stone",
  "minecraft:gilded_blackstone",
  "minecraft:quartz_bricks",
  "minecraft:reserved6",
  "minecraft:unknown",
  "minecraft:copper_block",
  "minecraft:lit_redstone_ore",
  "minecraft:waxed_weathered_double_cut_copper_slab",
  "minecraft:polished_blackstone_bricks",
  "minecraft:cut_copper",
  "minecraft:iron_ore",
  "minecraft:brick_block",
  "minecraft:element_87",
  "minecraft:waxed_weathered_cut_copper",
  "minecraft:jigsaw",
  "minecraft:shroomlight",
  "minecraft:chiseled_polished_blackstone",
  "minecraft:chiseled_deepslate",
  "minecraft:coral_block",
  "minecraft:raw_copper_block",
  "minecraft:lapis_ore",
  "minecraft:beehive",
  "minecraft:deepslate_diamond_ore",
  "minecraft:element_95",
  "minecraft:lit_furnace",
  "minecraft:element_13",
  "minecraft:cyan_glazed_terracotta",
  "minecraft:cracked_deepslate_bricks",
  "minecraft:deepslate_emerald_ore",
  "minecraft:stripped_crimson_stem",
  "minecraft:dirt_with_roots",
  "minecraft:coal_block",
  "minecraft:deepslate_bricks",
  "minecraft:clay",
  "minecraft:element_77",
  "minecraft:element_100",
  "minecraft:element_101",
  "minecraft:element_103",
  "minecraft:element_104",
  "minecraft:element_105",
  "minecraft:element_106",
  "minecraft:element_108",
  "minecraft:element_109",
  "minecraft:element_112",
  "minecraft:element_110",
  "minecraft:element_114",
  "minecraft:white_glazed_terracotta",
  "minecraft:stripped_warped_hyphae",
  "minecraft:element_50",
  "minecraft:element_46",
  "minecraft:magma",
  "minecraft:dirt",
  "minecraft:bee_nest",
  "minecraft:element_28",
  "minecraft:element_8",
  "minecraft:soul_soil",
  "minecraft:soul_sand",
  "minecraft:cobbled_deepslate_double_slab",
  "minecraft:double_stone_slab",
  "minecraft:reinforced_deepslate",
  "minecraft:fletching_table",
  "minecraft:black_glazed_terracotta",
  "minecraft:planks",
  "minecraft:stripped_acacia_log",
  "minecraft:crimson_stem",
  "minecraft:stripped_birch_log",
  "minecraft:element_56",
  "minecraft:barrier",
  "minecraft:prismarine",
  "minecraft:element_92",
  "minecraft:grass",
  "minecraft:element_10",
  "minecraft:deepslate_gold_ore",
  "minecraft:exposed_cut_copper",
  "minecraft:bookshelf",
  "minecraft:stained_hardened_clay",
  "minecraft:element_23",
  "minecraft:element_3",
  "minecraft:double_stone_slab2",
  "minecraft:element_22",
  "minecraft:element_2",
  "minecraft:double_stone_slab3",
  "minecraft:element_51",
  "minecraft:warped_nylium",
  "minecraft:log",
  "minecraft:element_37",
  "minecraft:element_64",
  "minecraft:furnace",
  "minecraft:iron_block",
  "minecraft:element_69",
  "minecraft:purple_glazed_terracotta",
  "minecraft:chain_command_block",
  "minecraft:element_91",
  "minecraft:red_sandstone",
  "minecraft:green_glazed_terracotta",
  "minecraft:deepslate_redstone_ore",
  "minecraft:element_99",
  "minecraft:cobbled_deepslate",
  "minecraft:mud",
  "minecraft:crying_obsidian",
  "minecraft:waxed_exposed_double_cut_copper_slab",
  "minecraft:mud_bricks",
  "minecraft:bell",
  "minecraft:allow",
  "minecraft:sculk",
  "minecraft:deepslate_coal_ore",
  "minecraft:weathered_cut_copper",
  "minecraft:cracked_polished_blackstone_bricks",
  "minecraft:chiseled_nether_bricks",
  "minecraft:deepslate_lapis_ore",
  "minecraft:nether_brick",
  "minecraft:deepslate_iron_ore",
  "minecraft:element_20",
  "minecraft:element_0",
  "minecraft:element_24",
  "minecraft:element_4",
  "minecraft:element_27",
  "minecraft:element_7",
  "minecraft:element_26",
  "minecraft:element_6",
  "minecraft:element_29",
  "minecraft:element_9",
  "minecraft:camera",
  "minecraft:waxed_cut_copper",
  "minecraft:element_47",
  "minecraft:emerald_ore",
  "minecraft:brown_mushroom_block",
  "minecraft:element_61",
  "minecraft:dropper",
  "minecraft:element_83",
  "minecraft:netherreactor",
  "minecraft:chemical_heat",
  "minecraft:waxed_oxidized_double_cut_copper_slab",
  "minecraft:sea_lantern",
  "minecraft:blast_furnace",
  "minecraft:raw_iron_block",
  "minecraft:dispenser",
  "minecraft:blackstone",
  "minecraft:lit_deepslate_redstone_ore",
  "minecraft:element_12",
  "minecraft:element_14",
  "minecraft:element_15",
  "minecraft:element_17",
  "minecraft:element_36",
  "minecraft:element_34",
  "minecraft:element_35",
  "minecraft:element_32",
  "minecraft:element_33",
  "minecraft:element_30",
  "minecraft:element_31",
  "minecraft:element_38",
  "minecraft:element_58",
  "minecraft:element_59",
  "minecraft:element_54",
  "minecraft:element_55",
  "minecraft:element_57",
  "minecraft:element_53",
  "minecraft:element_49",
  "minecraft:element_48",
  "minecraft:element_45",
  "minecraft:element_42",
  "minecraft:element_40",
  "minecraft:element_70",
  "minecraft:element_71",
  "minecraft:element_76",
  "minecraft:element_74",
  "minecraft:element_75",
  "minecraft:element_78",
  "minecraft:element_65",
  "minecraft:element_60",
  "minecraft:element_63",
  "minecraft:element_62",
  "minecraft:element_90",
  "minecraft:element_94",
  "minecraft:element_96",
  "minecraft:element_88",
  "minecraft:element_81",
  "minecraft:element_80",
  "minecraft:element_86",
  "minecraft:lit_smoker",
  "minecraft:purpur_block",
  "minecraft:polished_deepslate",
  "minecraft:dried_kelp_block",
  "minecraft:weathered_copper",
  "minecraft:gray_glazed_terracotta",
  "minecraft:lodestone",
  "minecraft:cartography_table",
];

forEachValidPlayer((player, { currentTick }) => {
  const block = player.dimension.getBlock(
    SA.Models.entity.locationToBlockLocation(player.location)
  );
  const get = () => log.get(player) ?? new PrevLo(player, currentTick, log);
  if (!FULL_BLOCKS.includes(block.id)) return get().update();
  // Player is inside a block
  get().back();
});
