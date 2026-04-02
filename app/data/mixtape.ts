export type Track = {
  id: string;
  number: number;
  title: string;
  artist?: string;
  duration?: string;
  mp3Url: string;
};

export type Mixtape = {
  slug: string;
  title: string;
  artist: string;
  eraLabel: string;
  description: string;
  coverImage?: string;
  tracks: Track[];
};

export const mixtape: Mixtape = {
  slug: "wolnosc-finansowa",
  title: "WOLNOŚĆ FINANSOWA",
  artist: "BIAŁAS I LANEK",
  eraLabel: "Mixtape",
  description: "Jedna taśma, jedenaście numerów.",
  tracks: [
    {
      id: "track-01",
      number: 1,
      title: "Wolność finansowa",
      duration: "2:11",
      mp3Url: "/assets/01-wolnosc-finansowa.mp3",
    },
    {
      id: "track-02",
      number: 2,
      title: "Tony Halik",
      duration: "2:02",
      mp3Url: "/assets/02-tony-halik.mp3",
    },
    {
      id: "track-03",
      number: 3,
      title: "Impreza u Anki",
      duration: "2:34",
      mp3Url: "/assets/03-impreza-u-anki.wav",
    },
    {
      id: "track-04",
      number: 4,
      title: "Lajkonik",
      duration: "1:39",
      mp3Url: "/assets/04-lajkonik.mp3",
    },
    {
      id: "track-05",
      number: 5,
      title: "In Hajs We Trust",
      duration: "3:00",
      mp3Url: "/assets/05-in-hajs-we-trust.mp3",
    },
    {
      id: "track-06",
      number: 6,
      title: "Trzeźwy na pewno nie zasnę",
      duration: "2:30",
      mp3Url: "/assets/06-trzezwy-na-pewno-nie-zasne.mp3",
    },
    {
      id: "track-07",
      number: 7,
      title: "Czas to pieniądz",
      duration: "1:54",
      mp3Url: "/assets/07-czas-to-pieniadz.mp3",
    },
    {
      id: "track-08",
      number: 8,
      title: "To właśnie ja",
      duration: "2:06",
      mp3Url: "/assets/08-to-wlasnie-ja.mp3",
    },
    {
      id: "track-09",
      number: 9,
      title: "Spongebob",
      duration: "2:29",
      mp3Url: "/assets/09-spongebob.mp3",
    },
    {
      id: "track-10",
      number: 10,
      title: "Imprezowy czołg",
      duration: "2:50",
      mp3Url: "/assets/10-imprezowy-czolg.mp3",
    },
    {
      id: "track-11",
      number: 11,
      title: "Ballin",
      duration: "2:24",
      mp3Url: "/assets/11-ballin.mp3",
    },
  ],
};
