# Torneo di Baseball U15 · Tenerife

Pagina web per la raccolta delle adesioni al **Torneo Internazionale di Baseball
categoria U15** che si terrà a **Tenerife a fine novembre**.

## Contenuto

- `index.html` — pagina di presentazione del torneo e modulo di adesione
- `styles.css` — stile della pagina
- `script.js` — validazione del modulo, salvataggio adesioni ed esportazione

## Come usarla

Apri `index.html` in un browser (oppure pubblicala con un hosting statico, es.
GitHub Pages). Le squadre possono compilare il modulo con i propri dati.

### Funzionalità

- **Modulo di adesione** con validazione dei campi obbligatori.
- **Salvataggio locale**: le adesioni vengono memorizzate nel `localStorage` del
  browser (nessun backend richiesto).
- **Area organizzatori**: tabella riepilogativa delle adesioni con possibilità di
  **esportazione in CSV** e cancellazione.

> Nota: i dati sono salvati nel browser in cui viene compilato il modulo. Per una
> raccolta centralizzata multi-dispositivo è necessario collegare un backend o un
> servizio di moduli (es. Google Forms, Formspree, un'API dedicata).
