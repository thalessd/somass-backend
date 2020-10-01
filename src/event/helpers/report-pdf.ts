import { Response } from 'express';
import { SimpleEvent } from '../models/simple-event';
import * as PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SimpleVacancy } from '../../vacancies/models/simple-vacancy';
import { version } from 'pjson';

type ListItem = {
  name: string;
  position: number;
  isEscort: boolean;
};

export class ReportPdf {
  private static lineFooterY = 792;
  private static lineFooterSpace = 10;

  private static lineHeaderY = 17;
  private static lineHeaderSpace = 15;
  private static lineHeaderYEnd = 17;

  private static grayDividerColor = '#DFDFDF';
  private static grayLineColor = '#6d6d6d';
  private static greyFooter = '#727272';

  private static goldColor = '#000f5f';
  private static grayHeader = '#5d5d5d';

  private static maxPerPageWithHeader = 33;
  private static maxPerPageWithoutHeader = 34;

  private static fonts = {
    cairoRegular: 'assets/fonts/Cairo-Regular.ttf',
    cairoBold: 'assets/fonts/Cairo-Bold.ttf',
    dancingScriptMedium: 'assets/fonts/DancingScript-Medium.ttf',
    dancingScriptBold: 'assets/fonts/DancingScript-Bold.ttf',
  };

  private static makeFooter(doc: any) {
    const logoWidth = 72;
    const logoHeight = 20;

    const dividerSpacing = 6;

    doc.font(this.fonts.cairoRegular).fillColor(this.greyFooter);

    doc
      .moveTo(doc.page.margins.left, this.lineFooterY)
      .lineTo(doc.page.width - doc.page.margins.right, this.lineFooterY)
      .lineWidth(1)
      .lineCap('round')
      .stroke(this.goldColor);

    doc.image(
      'assets/images/devdes-brand.png',
      doc.page.margins.left,
      this.lineFooterY + this.lineFooterSpace,
      {
        fit: [logoWidth, logoHeight],
      },
    );

    let currentWidth = doc.page.margins.left + logoWidth + dividerSpacing;

    doc
      .moveTo(currentWidth, this.lineFooterY + this.lineFooterSpace)
      .lineTo(
        currentWidth,
        this.lineFooterY + this.lineFooterSpace + logoHeight,
      )
      .lineWidth(1)
      .lineCap('round')
      .stroke(this.grayDividerColor);

    currentWidth += dividerSpacing;

    const devInfoTextLineOne = 'www.devdes.io | 89 99988 9460';
    const devInfoTextLineTwo = 'Desenvolvido por: Thales Carvalho';

    doc
      .fontSize(10)
      .text(
        devInfoTextLineOne + '\n' + devInfoTextLineTwo,
        currentWidth,
        this.lineFooterY + 4,
        {
          align: 'left',
          baseline: 'top',
          lineGap: -5,
        },
      );

    currentWidth += doc.widthOfString(devInfoTextLineTwo) + dividerSpacing;

    doc
      .moveTo(currentWidth, this.lineFooterY + this.lineFooterSpace)
      .lineTo(
        currentWidth,
        this.lineFooterY + this.lineFooterSpace + logoHeight,
      )
      .lineWidth(1)
      .lineCap('round')
      .stroke(this.grayDividerColor);

    currentWidth += dividerSpacing;

    const systemInfoTextLineOne = `Versão da Aplicação: ${version}`;
    const systemInfoTextLineTwo = `Data de Geração: ${format(
      new Date(),
      "dd/MM/yyyy 'às' HH:mm",
    )}`;

    doc
      .fontSize(10)
      .text(
        systemInfoTextLineOne + '\n' + systemInfoTextLineTwo,
        currentWidth,
        this.lineFooterY + 4,
        {
          align: 'left',
          baseline: 'top',
          lineGap: -5,
        },
      );
  }

  private static makeHeader(
    doc: any,
    simpleEvent: SimpleEvent,
    pageNumber: number,
    letterArray: string[],
    eventType: string
  ) {
    let dateTitle = `${eventType}, `;

    dateTitle += format(
      new Date(simpleEvent.date),
      "EEEE', dia' dd, 'às' HH'h' mm BBBBB 'em' MMMM",
      {
        locale: ptBR,
      },
    );

    dateTitle += '.';

    doc
      .fillColor(this.goldColor)
      .font(this.fonts.dancingScriptBold)
      .fontSize(16)
      .text(dateTitle, doc.page.margins.left, this.lineHeaderY);

    doc.fillColor(this.grayHeader).font(this.fonts.cairoBold).fontSize(9);

    let currentHeight = this.lineHeaderY + 20;

    const locationLabel = `Local: ${simpleEvent.location}`;

    doc.text(locationLabel, doc.page.margins.left, currentHeight);

    const locationLabelWidth = doc.widthOfString(locationLabel);

    doc.text(
      `Vagas: ${simpleEvent.occupiedVacancies} de ${simpleEvent.totalVacancies}`,
      doc.page.margins.left + locationLabelWidth + 10,
      currentHeight,
    );

    currentHeight += 14 + this.lineHeaderSpace;

    this.makePageInfo(doc, currentHeight, pageNumber, letterArray);

    this.lineHeaderYEnd = currentHeight + 6;
  }

  private static makePageInfo(
    doc: any,
    startY: number,
    pageNumber: number,
    letterArray: string[],
  ) {
    doc
      .fillColor(this.goldColor)
      .font(this.fonts.cairoBold)
      .fontSize(8)
      .text(
        String(pageNumber).padStart(2, '0'),
        doc.page.width - doc.page.margins.right - 14,
        startY,
        {
          width: 14,
          align: 'right',
          baseline: 'bottom',
        },
      );

    doc
      .fillColor(this.goldColor)
      .font(this.fonts.cairoBold)
      .fontSize(8)
      .text(
        letterArray.join(', '),
        doc.page.width - doc.page.margins.right - 320,
        startY,
        { width: 300, align: 'right', baseline: 'bottom' },
      );

    doc
      .moveTo(doc.page.margins.left, startY)
      .lineTo(doc.page.width - doc.page.margins.right, startY)
      .lineWidth(1)
      .lineCap('round')
      .stroke(this.goldColor);
  }

  private static makeItemOfList(
    doc: any,
    initPosition: number,
    name: string,
    position: number,
    isEscort: boolean,
    showBottomBar = true,
  ) {
    const leftInit = doc.page.margins.left + (isEscort ? 15 : 0);

    doc.rect(leftInit, initPosition, 10, 10).lineWidth(0.5).stroke('#000');

    doc
      .fillColor('#000')
      .fontSize(11)
      .font(this.fonts.cairoRegular)
      .text(name.trim(), leftInit + 14, initPosition - 5.5);

    if (showBottomBar) {
      doc
        .moveTo(leftInit, initPosition + 15)
        .lineTo(doc.page.width - doc.page.margins.right, initPosition + 15)
        .lineWidth(0.5)
        .stroke(this.grayLineColor);
    }

    doc
      .fillColor('#000')
      .fontSize(7)
      .font(this.fonts.dancingScriptBold)
      .text(
        String(position).padStart(2, '0'),
        doc.page.width - doc.page.margins.right - 20,
        initPosition + 2,
        {
          align: 'right',
          width: 20,
        },
      );

    if (isEscort) {
      doc
        .fontSize(8)
        .font(this.fonts.dancingScriptMedium)
        .text(
          'Acompanhante',
          doc.page.width - doc.page.margins.right - 62,
          initPosition + 1,
          {
            align: 'left',
            width: 42,
          },
        );
    }
  }

  private static makeBody(
    doc: any,
    listItems: ListItem[],
    withHeader = false,
  ) {
    let initY = withHeader ? this.lineHeaderYEnd : this.lineHeaderY + 24;

    listItems.map((listItem: ListItem, idx: number) => {
      this.makeItemOfList(
        doc,
        initY,
        listItem.name,
        listItem.position,
        listItem.isEscort,
        idx !== listItems.length - 1,
      );

      initY += 22;
    });
  }

  private static makePage(
    doc: any,
    listItems: ListItem[],
    simpleEvent: SimpleEvent,
    pageNumber: number,
    showHeader: boolean,
    eventType: string
  ) {
    doc.addPage();

    let firstLetterArray: string[] = [];

    listItems.forEach((listItem: ListItem) => {
      if (listItem.isEscort) return;
      firstLetterArray.push(listItem.name.charAt(0).toUpperCase());
    });

    firstLetterArray = firstLetterArray.filter(
      (item, i, ar) => ar.indexOf(item) === i,
    );

    if (showHeader)
      this.makeHeader(doc, simpleEvent, pageNumber, firstLetterArray, eventType);
    else
      this.makePageInfo(
        doc,
        this.lineHeaderY + 18,
        pageNumber,
        firstLetterArray,
      );

    listItems = listItems.slice(
      0,
      showHeader ? this.maxPerPageWithHeader : this.maxPerPageWithoutHeader,
    );

    this.makeBody(doc, listItems, showHeader);

    this.makeFooter(doc);
  }

  static generate(simpleEvent: SimpleEvent, response: Response, eventType: string): void {
    const filename = `RelatorioDeParticipantes-${format(
      simpleEvent.date,
      'dd-MM-yyyy-HH-mm',
    )}-${simpleEvent.id}`;

    response.contentType('application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.pdf`,
    );

    const doc = new PDFDocument({
      margins: { top: 0, bottom: 0, left: 30, right: 30 },
      size: 'A4',
      autoFirstPage: false,
    });

    doc.pipe(response);

    const listItems: ListItem[] = [];
    let position = 0;

    simpleEvent.simpleVacancy.sort(function (a, b) {
      if (a.simpleClient.nameOfMain < b.simpleClient.nameOfMain) return -1;
      if (a.simpleClient.nameOfMain > b.simpleClient.nameOfMain) return 1;
      return 0;
    });

    simpleEvent.simpleVacancy.forEach((sv: SimpleVacancy) => {
      position++;

      listItems.push({
        name: sv.simpleClient.nameOfMain,
        position,
        isEscort: false,
      });

      sv.simpleClient.escortNames.forEach((escortName: string) => {
        position++;

        listItems.push({
          name: escortName,
          position,
          isEscort: true,
        });
      });
    });

    const listItemsByPage: ListItem[][] = [];

    const totPages =
      Math.ceil(
        (listItems.length - this.maxPerPageWithHeader) /
          this.maxPerPageWithoutHeader,
      ) + 1;

    let offset = 0;
    let limit = this.maxPerPageWithHeader;

    Array.from(Array(totPages).keys()).forEach(() => {
      listItemsByPage.push(listItems.slice(offset, limit));

      offset = limit;
      limit += this.maxPerPageWithoutHeader;
    });

    listItemsByPage.forEach((pageListItems: ListItem[], idx: number) => {
      this.makePage(doc, pageListItems, simpleEvent, idx + 1, idx === 0, eventType);
    });

    doc.end();
  }
}
