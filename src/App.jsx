import VerticalTimeline from "./VerticalTimeline";
// const data = [
//   {
//     indeks: 1306813,
//     date: "2023-05-26T14:43:39.290000Z",
//     stanowisko: 25,
//     uzytkownik: 35,
//     raport: "OkuwanieRam",
//     worker: "Artūras Brazauskas",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1306815,
//     date: "2023-05-26T14:44:10.913000Z",
//     stanowisko: 25,
//     uzytkownik: 35,
//     raport: "OkuwanieRam",
//     worker: "Artūras Brazauskas",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1306826,
//     date: "2023-05-26T14:47:01.060000Z",
//     stanowisko: 25,
//     uzytkownik: 35,
//     raport: "OkuwanieRam",
//     worker: "Artūras Brazauskas",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1306828,
//     date: "2023-05-26T14:47:26.737000Z",
//     stanowisko: 25,
//     uzytkownik: 35,
//     raport: "OkuwanieRam",
//     worker: "Artūras Brazauskas",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1308277,
//     date: "2023-05-29T11:30:30.183000Z",
//     stanowisko: 43,
//     uzytkownik: 136,
//     raport: "Komplektavimas",
//     worker: "Kateryna Poberzhniuk",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1309011,
//     date: "2023-05-29T15:12:30.877000Z",
//     stanowisko: 13,
//     uzytkownik: 111,
//     raport: "OkuwanieRamRotox",
//     worker: "Babin Dmitro",
//     status: null,
//     video_data: {
//       status: false,
//       camera_ip: "10.20.100.40",
//     },
//   },
//   {
//     indeks: 1309015,
//     date: "2023-05-29T15:14:49.293000Z",
//     stanowisko: 19,
//     uzytkownik: 64,
//     raport: "OkuwanieRamKaustymasStandartas",
//     worker: "Ramūnas Šiugžda",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
//   {
//     indeks: 1309612,
//     date: "2023-05-30T08:57:11.580000Z",
//     stanowisko: 4,
//     uzytkownik: 34,
//     raport: "StiklinimasMobiliNEWtest",
//     worker: "Mantas Supronas",
//     status: null,
//     video_data: {
//       status: false,
//     },
//   },
// ];

const data = [
  {
    OperationID: 50,
    OperationName: "Operation_control",
    operations: [
      {
        indeks: 1227966,
        zlecenieID: 1283619,
        zlecenie: "G21323",
        date: "2023-05-27 05:07:22.497",
      },
      {
        indeks: 1227967,
        zlecenieID: 1283619,
        zlecenie: "G21323",
        date: "2023-05-27 09:09:45.290",
      },
    ],
  },
  {
    OperationID: 12,
    OperationName: "Okuwabnnwiodwei",
    operations: [
      {
        indeks: 12,
        zlecenieID: 128123619,
        zlecenie: "G213wqw23",
        date: "2023-05-27 07:07:22.497",
      },
      {
        indeks: 21,
        zlecenieID: 122,
        zlecenie: "G21323",
        date: "2023-05-27 17:09:45.290",
      },
      {
        indeks: 21,
        zlecenieID: 122,
        zlecenie: "G21323",
        date: "2023-05-27 22:09:45.290",
      },
    ],
  },
];
export const App = () => {
  return (
    <>
      <VerticalTimeline
        data={data}
        minDate={new Date("2023-05-24T00:00:00.000Z")}
        maxDate={new Date("2023-05-30T23:59:59.000Z")}
      />
    </>
  );
};

export default App;
