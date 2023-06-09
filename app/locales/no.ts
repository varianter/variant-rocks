import { SubmitKey } from "../store/app";

const no = {
  WIP: "Under arbeid…",
  Error: {
    Unauthorized:
      "Uautorisert tilgang. Vennligst oppgi tilgangskode under 'Innstillinger'.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} meldinger`,
  },
  Chat: {
    SubTitle: (count: number) => `Totalt ${count} meldinger`,
    Actions: {
      ChatList: "Gå til chatteoversikt",
      CompressedHistory: "Huk av for å komprimere chat-historikk",
      Export: "Eksporter alle meldinger som Markdown",
      Copy: "Kopier",
      Stop: "Stopp",
      Retry: "Prøv igjen",
    },
    Rename: "Gi chat nytt navn",
    Typing: "Skriver…",
    Input: (submitKey: string) => {
      var inputHints = `Skriv noe og trykk ${submitKey} for å sende`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", trykk Shift + Enter for å starte ny linje";
      }
      return inputHints;
    },
    Send: "Send",
  },
  Export: {
    Title: "Alle meldinger",
    Copy: "Kopier alle",
    Download: "Last ned",
    MessageFromYou: "Melding fra deg",
    MessageFromChatGPT: "Melding fra VariantGPT",
  },
  Memory: {
    Title: "Minne-prompt",
    EmptyContent: "Ingenting ennå.",
    Send: "Send minne",
    Copy: "Kopier minne",
    Reset: "Tilbakestill økt",
    ResetConfirm:
      "Alle samtalehistorikk og historisk minne vil bli slettet ved tilbakestilling. Er du sikker på at du vil tilbakestille?",
  },
  Home: {
    NewChat: "Ny chat",
    DeleteChat: "Bekreft at du vil slette samtalen?",
    DeleteToast: "Chat slettet",
    Revert: "Tilbakestill",
  },
  Settings: {
    Title: "Innstillinger",
    SubTitle: "Alle innstillinger",
    Actions: {
      ClearAll: "Slett all data",
      ResetAll: "Tilbakestill alle innstillinger",
      Close: "Lukk",
    },
    Lang: {
      Name: "Språk",
      Options: {
        no: "Norsk",
        cn: "简体中文",
        en: "Engelsk",
        tw: "繁體中文",
        es: "Spansk",
        it: "Italiensk",
        se: "Svenska",
      },
    },
    Avatar: "Avator",
    FontSize: {
      Title: "Skriftstørrelse",
      SubTitle: "Endre skriftstørrelsen på chat-innholdet",
    },
    Update: {
      Version: (x: string) => `Versjon: ${x}`,
      IsLatest: "Nyeste versjon",
      CheckUpdate: "Sjekk oppdateringer",
      IsChecking: "Sjekker oppdateringer…",
      FoundUpdate: (x: string) => `Ny versjon tilgjengelig: ${x}`,
      GoToUpdate: "Oppdater",
    },
    SendKey: "Sende-tast",
    PrePrompt: "Innledende kontekst",
    Theme: "Tema",
    TightBorder: "Tettdekkende kantlinje",
    SendPreviewBubble: "Forhåndsvisningsboble",
    Prompt: {
      Disable: {
        Title: "Deaktiver auto-kompletering",
        SubTitle: "Skriv / for å starte auto-kompletering",
      },
      List: "Prompt-liste",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} innebygde, ${custom} brukerdefinerte`,
      Edit: "Rediger",
    },
    HistoryCount: {
      Title: "Antall vedlagte meldinger",
      SubTitle: "Antall meldinger som sendes i hver forespørsel",
    },
    CompressThreshold: {
      Title: "Terskelverdi for historiekomprimering",
      SubTitle:
        "Komprimer historikk hvis ukomprimert meldingslengde overstiger denne terskelverdien",
    },
    Token: {
      Title: "API-nøkkel",
      SubTitle: "Bruk nøkkelen din for å omgå tilgangskodebegrensninger",
      Placeholder: "OpenAI API-nøkkel",
    },
    Usage: {
      Title: "Konto balanse",
      SubTitle: (used: any, total: any) =>
        `Brukt $${used} denne måneden, abonnement $${total}`,
      IsChecking: "Sjekker…",
      Check: "Sjekk igjen",
      NoAccess: "Oppgi API-nøkkel for å sjekke balanse",
    },
    AccessCode: {
      Title: "Tilgangskode",
      SubTitle: "Tilgangskontroll aktivert",
      Placeholder: "Tilgangskode nødvendig",
    },
    Context: {
      Title: "Kontekst",
      SubTitle: "Sett global kontekst",
      Placeholder: "Brukerkontekst",
    },
    Model: "Modell",
    Temperature: {
      Title: "Temperatur",
      SubTitle: "Jo høyere verdi, jo mer tilfeldige svar",
    },
    MaxTokens: {
      Title: "Maksimalt antall token",
      SubTitle:
        "Maksimalt antall token for genererte meldinger og input-meldinger",
    },
    PresencePenlty: {
      Title: "Tilstedeværelsesstraff",
      SubTitle:
        "Jo høyere verdi, jo større sannsynlighet for å dreie samtalen inn mot nye temaer",
    },
  },
  Store: {
    DefaultTopic: "Ny samtale",
    BotHello: "Hei, hvordan kan jeg hjelpe deg i dag?",
    Error: "Noe gikk galt, vennligst prøv igjen senere.",
    Prompt: {
      History: (content: string) =>
        "Dette er en oppsummering av chat-historikken mellom AI og bruker som repetisjon: " +
        content,
      Topic:
        "Vennligst generer en tittel på fire til fem ord som oppsummerer samtalen uten å inkludere innledning, punktum, sitattegn eller noen annen tekst. Uten anførselstegn.",
      Summarize:
        "Oppsummer diskusjonen i 200 ord eller mindre for å bruke som utgangspunkt for fremtidig kontekst.",
    },
    ConfirmClearAll:
      "Bekreft at du vil slette all chat- og konfigurasjonsdata?",
  },
  Copy: {
    Success: "Kopiert til clipboard",
    Failed:
      "Kopiering mislyktes. Vennligst gi tillatelse til tilgang til clipboard.",
  },
  Context: {
    Toast: (x: any) => `Med ${x} kontekstuelle promps`,
    Edit: "Kontekstuelle og Memory Promps",
    Add: "Legg til en",
  },
};

export default no;
