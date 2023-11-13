import React, { useCallback, useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import PdfViewerCommandBar from './PdfViewerCommandBar';
import {
  CommandBarButton,
  TextField,
  IIconProps,
  ITextFieldStyles,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { ApiTokenCredential } from '../components/AuthProvider/ApiTokenCredential';
import { AuthenticationContext } from '../components/AuthProvider/AuthenticationContext';
import { storageAccountScope } from '../components/AuthProvider/msal/MsalConfig';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import env from '../env';

interface PdfViewerProps {
  ads_udi: string | undefined;
}
function PdfViewer(props: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [storageToken, setStorageToken] = useState<string>();

  const authContext = React.useContext(AuthenticationContext);

  const pageLeftClick = () => {
    let prevPage = pageNumber - 1;
    if (prevPage > 0) setPageNumber(prevPage);
  };

  const pageRightClick = () => {
    let nextPage = pageNumber + 1;
    if (nextPage <= numPages) setPageNumber(nextPage);
  };

  const pageZoomInClick = () => {
    let pageScale = scale + 0.1;
    if (pageScale <= 5) setScale(pageScale);
  };

  const pageZoomOutClick = () => {
    let pageScale = scale - 0.1;
    if (pageScale >= 1) setScale(pageScale);
  };

  const setPageManually = () => {
    console.log('set page from user input');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    let t = event.target as HTMLInputElement;
    if (event.key === 'Enter') {
      if (t.value && parseInt(t.value) !== pageNumber) {
        let userEnteredPage = parseInt(t.value);
        if (userEnteredPage <= numPages) {
          setPageNumber(userEnteredPage);
        }
      }
    }
  };

  const statusIcon: IIconProps = { iconName: 'NumberSymbol' };
  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 50, fontSize: 9, top: 5 } };

  // Custom renderer for inputing page number
  // do I want or even need the button if I trigger on keydown
  const CustomButton: React.FunctionComponent<ICommandBarItemProps> = (props) => {
    return (
      <>
        <TextField styles={textFieldStyles} defaultValue={pageNumber.toString()} onKeyDown={onKeyDown} />
        <CommandBarButton iconProps={statusIcon} onClick={setPageManually} />
      </>
    );
  };
  const CustomItem: ICommandBarItemProps = {
    key: 'customItem',
    commandBarButtonAs: CustomButton,
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const fetchBlob = useCallback((ads_udi: string) => {
    authContext.getAccessToken([storageAccountScope]).then((result) => {
      const containerClient = new ContainerClient(`${env.storageAccountUri}/processed`, new ApiTokenCredential(result));

      const pdfBlob: BlockBlobClient = containerClient.getBlockBlobClient(`${ads_udi}.pdf`);
      setPdfUrl(pdfBlob.url);
      setStorageToken(result);
    });
  }, []);

  useEffect(() => {
    if (props.ads_udi) fetchBlob(props.ads_udi);
  }, [fetchBlob, props.ads_udi]);

  let pdfDocument = (
    <Document
      file={{
        url: pdfUrl,
        httpHeaders: { Authorization: `Bearer ${storageToken}`, 'x-ms-version': '2017-11-09' },
      }}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <Page pageNumber={pageNumber} scale={scale} />
    </Document>
  );

  if (!props.ads_udi || !pdfUrl) pdfDocument = <>PDF not found</>;
  return (
    <>
      <PdfViewerCommandBar
        onPageLeftClick={pageLeftClick}
        onPageRightClick={pageRightClick}
        onZoomInClick={pageZoomInClick}
        onZoomOutClick={pageZoomOutClick}
        CustomItem={CustomItem}
      />
      {pdfDocument}
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </>
  );
}

export default React.memo(PdfViewer);
