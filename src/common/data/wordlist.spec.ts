import { UInt8ArrayToWords } from "./wordlist"

describe("wordlist.spec", () => {
  it("should match", async () => {
    const wordsOdd = 'aardvark absurd accrue acme adrift adult afflict ahead aimless Algol allow alone ammo ancient apple artist assume Athens atlas Aztec baboon backfield backward basalt beaming bedlamp beehive beeswax befriend Belfast berserk billiard bison blackjack blockade blowtorch bluebird bombast bookshelf brackish breadline breakup brickyard briefcase Burbank button buzzard cement chairlift chatter checkup chisel choking chopper Christmas clamshell classic classroom cleanup clockwork cobra commence concert cowbell crackdown cranky crowfoot crucial crumpled crusade cubic deadbolt deckhand dogsled dosage dragnet drainage dreadful drifter dropper drumbeat drunken Dupont dwelling eating edict egghead eightball endorse endow enlist erase escape exceed eyeglass eyetooth facial fallout flagpole flatfoot flytrap fracture fragile framework freedom frighten gazelle Geiger Glasgow glitter glucose goggles goldfish gremlin guidance hamlet highchair hockey hotdog indoors indulge inverse involve island Janus jawbone keyboard kickoff kiwi klaxon lockup merit minnow miser Mohawk mural music Neptune newborn nightbird obtuse offload oilfield optic orca payday peachy pheasant physique playhouse Pluto preclude prefer preshrunk printer profile prowler pupil puppy python quadrant quiver quota ragtime ratchet rebirth reform regain reindeer rematch repay retouch revenge reward rhythm ringbolt robust rocker ruffled sawdust scallion scenic scorecard Scotland seabird select sentence shadow showgirl skullcap skydive slingshot slothful slowdown snapline snapshot snowcap snowslide solo spaniel spearhead spellbind spheroid spigot spindle spoilage spyglass stagehand stagnate stairway standard stapler steamship stepchild sterling stockman stopwatch stormy sugar surmount suspense swelter tactics talon tapeworm tempest tiger tissue tonic tracker transit trauma treadmill Trojan trouble tumor tunnel tycoon umpire uncut unearth unwind uproot upset upshot vapor village virus Vulcan waffle wallet watchword wayside willow woodlark Zulu'
    const wordsEven = 'adroitness adviser aggregate alkali almighty amulet amusement antenna applicant Apollo armistice article asteroid Atlantic atmosphere autopsy Babylon backwater barbecue belowground bifocals bodyguard borderline bottomless Bradbury Brazilian breakaway Burlington businessman butterfat Camelot candidate cannonball Capricorn caravan caretaker celebrate cellulose certify chambermaid Cherokee Chicago clergyman coherence combustion commando company component concurrent confidence conformist congregate consensus consulting corporate corrosion councilman crossover cumbersome customer Dakota decadence December decimal designing detector detergent determine dictator dinosaur direction disable disbelief disruptive distortion divisive document embezzle enchanting enrollment enterprise equation equipment escapade Eskimo everyday examine existence exodus fascinate filament finicky forever fortitude frequency gadgetry Galveston getaway glossary gossamer graduate gravity guitarist hamburger Hamilton handiwork hazardous headwaters hemisphere hesitate hideaway holiness hurricane hydraulic impartial impetus inception indigo inertia infancy inferno informant insincere insurgent integrate intention inventive Istanbul Jamaica Jupiter leprosy letterhead liberty maritime matchmaker maverick Medusa megaton microscope microwave midsummer millionaire miracle misnomer molasses molecule Montana monument mosquito narrative nebula newsletter Norwegian October Ohio onlooker opulent Orlando outfielder Pacific pandemic pandora paperweight paragon paragraph paramount passenger pedigree Pegasus penetrate perceptive performance pharmacy phonetic photograph pioneer pocketful politeness positive potato processor prophecy provincial proximate puberty publisher pyramid quantity racketeer rebellion recipe recover repellent replica reproduce resistor responsive retraction retrieval retrospect revenue revival revolver Sahara sandalwood sardonic Saturday savagery scavenger sensation sociable souvenir specialist speculate stethoscope stupendous supportive surrender suspicious sympathy tambourine telephone therapist tobacco tolerance tomorrow torpedo tradition travesty trombonist truncated typewriter ultimate undaunted underfoot unicorn unify universe unravel upcoming vacancy vagabond versatile vertigo Virginia visitor vocalist voyager warranty Waterloo whimsical Wichita Wilmington Wyoming yesteryear Yucatan'

    expect(wordsOdd.split(' ')).toHaveLength(256)
    expect(wordsEven.split(' ')).toHaveLength(256)

    // console.log('const wordsOdd = ' + JSON.stringify(wordsOdd.split(' ')))
    // console.log('const wordsEven = ' + JSON.stringify(wordsEven.split(' ')))

    expect(UInt8ArrayToWords(new Uint8Array([1,2,255,254]), '-', ' / ')).toMatchInlineSnapshot('"absurd-aggregate / Zulu-yesteryear"')
    expect(UInt8ArrayToWords(new Uint8Array([1,2,88]), '-', ' / ')).toMatchInlineSnapshot('"absurd-aggregate / endorse"')
  })
})