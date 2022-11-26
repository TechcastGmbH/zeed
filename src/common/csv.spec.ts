import { csvParse, csvStringify} from './csv'

describe("csv.spec", () => {
  it("should generate csv", async () => {
    let txt = csvStringify([
      [1, "one", 1e10, '1e10', 1.23],
      [2, "two\nlines", null, undefined, true],
      [3, "tree \"drei\"", {}, {a:1}, [1,2,3]],
    ])
    expect(txt).toMatchInlineSnapshot(`
      "1,one,10000000000,1e10,1.23
      2,\\"two
      lines\\",,,1
      3,\\"tree \\"\\"drei\\"\\"\\",{},\\"{\\"\\"a\\"\\":1}\\",\\"[1,2,3]\\"
      "
    `)

    expect(csvParse(txt)).toMatchInlineSnapshot(`
      Array [
        Array [
          "1",
          "one",
          "10000000000",
          "1e10",
          "1.23",
        ],
        Array [
          "2",
          "two
      lines",
          "",
          "",
          "1",
        ],
        Array [
          "3",
          "tree \\"drei\\"",
          "{}",
          "{\\"a\\":1}",
          "[1,2,3]",
        ],
      ]
    `)
  })

  it('should parse', () => {
    const sample = `\
"Zeitpunkt";"timestamp";"D0";"V0";"V0_max";"T0";"F0";"G0";"S0";"R0";"M0";"T1";"L0";"L0_nn"
"26.10.2022, 23:00";"1666825201";"155";"4";"6";"146";"80";"9";"0";"0";"0";"135";"0";"10102"
"26.10.2022, 23:10";"1666825801";"161";"4";"7";"145";"80";"8";"0";"0";"0";"135";"0";"10102"
"26.10.2022, 23:20";"1666826401";"160";"4";"7";"145";"81";"9";"0";"0";"0";"135";"0";"10102"
"26.10.2022, 23:30";"1666827001";"160";"4";"7";"145";"81";"8";"0";"0";"0";"134";"0";"10102"
"26.10.2022, 23:40";"1666827601";"151";"4";"7";"145";"81";"9";"0";"0";"0";"134";"0";"10102"
"26.10.2022, 23:50";"1666828201";"149";"4";"7";"147";"80";"9";"0";"0";"0";"137";"0";"10102"
"27.10.2022, 00:00";"1666828801";"151";"4";"7";"147";"80";"9";"0";"0";"0";"137";"0";"10102"
"27.10.2022, 00:10";"1666829401";"154";"4";"6";"148";"80";"9";"0";"0";"0";"137";"0";"10102"
"27.10.2022, 00:20";"1666830001";"150";"4";"7";"147";"80";"9";"0";"0";"0";"137";"0";"10102"`

    let data = csvParse(sample)
    expect(data).toMatchInlineSnapshot(`
      Array [
        Array [
          "Zeitpunkt",
          "timestamp",
          "D0",
          "V0",
          "V0_max",
          "T0",
          "F0",
          "G0",
          "S0",
          "R0",
          "M0",
          "T1",
          "L0",
          "L0_nn",
        ],
        Array [
          "26.10.2022, 23:00",
          "1666825201",
          "155",
          "4",
          "6",
          "146",
          "80",
          "9",
          "0",
          "0",
          "0",
          "135",
          "0",
          "10102",
        ],
        Array [
          "26.10.2022, 23:10",
          "1666825801",
          "161",
          "4",
          "7",
          "145",
          "80",
          "8",
          "0",
          "0",
          "0",
          "135",
          "0",
          "10102",
        ],
        Array [
          "26.10.2022, 23:20",
          "1666826401",
          "160",
          "4",
          "7",
          "145",
          "81",
          "9",
          "0",
          "0",
          "0",
          "135",
          "0",
          "10102",
        ],
        Array [
          "26.10.2022, 23:30",
          "1666827001",
          "160",
          "4",
          "7",
          "145",
          "81",
          "8",
          "0",
          "0",
          "0",
          "134",
          "0",
          "10102",
        ],
        Array [
          "26.10.2022, 23:40",
          "1666827601",
          "151",
          "4",
          "7",
          "145",
          "81",
          "9",
          "0",
          "0",
          "0",
          "134",
          "0",
          "10102",
        ],
        Array [
          "26.10.2022, 23:50",
          "1666828201",
          "149",
          "4",
          "7",
          "147",
          "80",
          "9",
          "0",
          "0",
          "0",
          "137",
          "0",
          "10102",
        ],
        Array [
          "27.10.2022, 00:00",
          "1666828801",
          "151",
          "4",
          "7",
          "147",
          "80",
          "9",
          "0",
          "0",
          "0",
          "137",
          "0",
          "10102",
        ],
        Array [
          "27.10.2022, 00:10",
          "1666829401",
          "154",
          "4",
          "6",
          "148",
          "80",
          "9",
          "0",
          "0",
          "0",
          "137",
          "0",
          "10102",
        ],
        Array [
          "27.10.2022, 00:20",
          "1666830001",
          "150",
          "4",
          "7",
          "147",
          "80",
          "9",
          "0",
          "0",
          "0",
          "137",
          "0",
          "10102",
        ],
      ]
    `)
    
  });
})