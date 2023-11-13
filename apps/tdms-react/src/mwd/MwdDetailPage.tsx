import React from 'react';
import { PageWithIntro, Description, ImportantNotes } from '@nwm/uifabric';
import { TodoPlaceholder } from '@nwm/util';
import MwdModelInformationTable from './MwdModelInformationTable';
import MwdContent from './MwdContent';

// Remove or update this item to reflect real data source
const dataRecord = {
  dataTitle: 'source',
  dataDescription: 'Description',
  dataAcquisition: 'Acquisition',
  dataDtn: 'LB0112ABN3MDLG.001',
  dataVerifcationStatus: '',
  dataQualifStatus: 'Unqualified',
  dataPrelimData: 'No',
  dataParameters: ['CONCENTRATION', 'SEEPAGE FRACTION'],
  dataHeaderNote:
    'When using any of the information herein, the Data Tracking Number, Qualification Status, TBV Status, and any\n' +
    '      Disclaimers, Constraints, Limitations, etc.... Should be kept with your downloaded data',
  dataDetails: (
    <TodoPlaceholder description="Drop in table of MWD record details and provide record information via props." />
  ),
};

export default function MwdDetailPage() {
  return (
    <PageWithIntro title="Model Warehouse Dataset">
      <Description
        title={dataRecord.dataTitle}
        description={dataRecord.dataDescription}
        developmentMethod={dataRecord.dataAcquisition}
      />

      <MwdModelInformationTable />
      <MwdContent />
      <ImportantNotes
        dtn={dataRecord.dataDtn}
        verificationStatus={dataRecord.dataVerifcationStatus}
        qualifStatus={dataRecord.dataQualifStatus}
        preliminaryData={dataRecord.dataPrelimData}
        parameters={dataRecord.dataParameters}
        headerNote={dataRecord.dataHeaderNote}
      />
    </PageWithIntro>
  );
}
