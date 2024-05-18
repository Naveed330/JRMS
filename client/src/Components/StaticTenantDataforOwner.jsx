import React, { useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import OwnerSideBar from '../../Components/OwnerSideBar';
import logo from '../OwnerPages/logo.png'
const StaticTenantDataforOwner = () => {

    const location = useLocation();    
    const state = location.state;
    const navigate = useNavigate()
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);

    const { contractInfo, ownerId, property } = state.tenantDetails;
    console.log(property, 'staticDataproperty');

    const downloadAsPdf = () => {
        setIsDownloadClicked(true);
        const element = document.getElementById('table-to-download');
        console.log(element, 'element');
        const opt = {
            margin: 1,
            filename: 'tenant_details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() / 3, pdf.internal.pageSize.getHeight() - 0.5);
            }
        }).save();
    };

    return (
        <div  >
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <OwnerSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div id="table-to-download">

                                <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
                                    <h4>Jovera Group A Complete Real-Estate and  Financial Solution </h4>
                                    <img src={logo} alt="logo" style={{ width: '100px' }} />
                                    <h4>Jovera Group حل عقاري ومالي متكامل </h4>
                                </div>

                                <div className='mt-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <h5 style={{ textTransform: 'uppercase' }} >Tenancy Contract & Tax Invoice</h5>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }} >
                                    <h3 className='text-center'>Tenant Details</h3>
                                    {/* <Button style={{ color: 'white', backgroundColor: '#d588ff', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf}>Download as PDF</Button> */}
                                    {!isDownloadClicked && (
                                        <Button variant="danger" style={{ color: 'white', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf} >Download as PDF</Button>
                                    )}                                </div>




                                {/* Contract Details Table */}
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '10px' }}>
                                    <Table striped hover responsive style={{ border: '1px solid black', marginTop: '10px' }} key={contractInfo._id}>
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th rowSpan={2} colspan={2} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل العقد </th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{state.tenantDetails._id}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >رقم العقد</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Starting Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(contractInfo.startingDate).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >End Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(contractInfo.endDate).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ الانتهاء</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Security Deposit</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {contractInfo.securitydeposite && contractInfo.securitydeposite} </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مبلغ التأمين</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Grace Period (days)</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.graceperiod && contractInfo.graceperiod}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فترة السماح (بالأيام)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Number of Occupants</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.numberofoccupants && contractInfo.numberofoccupants}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >عدد الشاغلين</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Water and Elec Bill</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.Waterandelecbill && contractInfo.Waterandelecbill}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Usage</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.usage && contractInfo.usage}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >الاستخدام</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Total Contract Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.totalContractAmount && contractInfo.totalContractAmount}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >إجمالي مبلغ العقد</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >VAT (%)</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.VAT && contractInfo.VAT}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >ضريبة القيمة المضافة (%)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Other Cost</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.otherCost && contractInfo.otherCost}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تكلفة أخرى</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Parking</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.parking ? 'Yes' : 'No'}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >موقف سيارات</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Discount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.discount && contractInfo.discount}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تخفيض</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Final Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.finalAmount && contractInfo.finalAmount}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >القيمة النهائية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Paid Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.paidAmount && contractInfo.paidAmount}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >المبلغ المدفوع</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Bank</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.bank && contractInfo.bank}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >بنك</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Total Checks</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.totalChecks && contractInfo.totalChecks}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >إجمالي الشيكات</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >National ID</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.nid && ownerId.nid}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >الهوية الوطنية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Email</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.email && ownerId.email}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >بريد إلكتروني</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Contact</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.contact && ownerId.contact}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اتصال</td>
                                            </tr>

                                            {/* {
            property?.map((item) => {
                console.log(item, 'itemproperty');
                return (
                    <> */}
                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Property Name</td>
                                                        <td className='text-center' >{property?.name && property?.name}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اسم الخاصية</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Description</td>
                                                        <td className='text-center'>{property?.description && property?.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >وصف</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Address</td>
                                                        <td className='text-center'>{property?.address && property?.address}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >عنوان</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>City</td>
                                                        <td className='text-center'>{property?.city && property?.city}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مدينة</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                        <td className='text-center'>{property?.propertyType && property?.propertyType}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >نوع الملكية</td>
                                                    </tr>
                                                    : null
                                            }
                                            {/* </>
                )
            })
        } */}

                                            {/* <tr>
        <td style={{ backgroundColor: '#e7e6e6' }}>Property Image</td>
        <td className='text-center'><img src={property[0]?.propertyImage} alt="Property" style={{ width:'100px' }} /></td>
        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }}>Property Image</td>
    </tr> */}

                                        </tbody>
                                    </Table>
                                    <Table striped hover responsive style={{ border: '1px solid black' }}>
                                        <thead  >
                                            <th className='text-center' >All payments to be made to the benefits of Jovera Group <br /> or any other party designed by the lessor</th>
                                            <th colSpan={2} className='text-center' >يجب سداد جميع المدفوعات لصالح مجموعة Jovera أو أي طرف آخر يحدده المؤجر</th>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className='text-center' >Additional Terms</td>
                                                <td>Renewal /6 pauments /EIFM - 22% staff discount of AED 26,000 Rent</td>
                                                <td>شروط إضافية</td>
                                            </tr>

                                            <tr>
                                                <td className='text-center' >The terms and condition set out at the back policy contract are <br /> an integral part of this contract</td>
                                                <td colSpan={2} className='text-center'>تعتبر الشروط والأحكام المنصوص عليها في عقد سياسة الظهر جزءًا لا يتجزأ من هذا العقد</td>
                                            </tr>

                                            <tr style={{ backgroundColor: 'white' }} >
                                                <td className='text-center'>
                                                    <p style={{ paddingBottom: '30px' }} >Signature of Landlord (Lessor)</p>
                                                    <p>Date : 26-04-2024</p>
                                                    <p>Prepared by : Sheikha Ali Mohamed</p>
                                                </td>
                                                <td colSpan={2} className='text-center'>
                                                    <p style={{ paddingBottom: '30px' }} >Signature of Tenants (Lessor)</p>
                                                </td>
                                            </tr>



                                        </tbody>
                                    </Table>

                                    <div style={{ display: 'flex', justifyContent: 'space-around' }} className='mt-4' >
                                        <div>
                                            <p>AL-Jazeera Club Tower-A 8th floor</p>
                                            <p>*Tel: +97100000000 *Fax: +9712222222</p>
                                            <p>P.O.Box: 5252444, Abu Dhabi , United Arab Emirates</p>
                                        </div>

                                        <div>
                                            <p>برج نادي الجزيرة-أ الدور الثامن</p>
                                            <p>*هاتف: +97100000000 *فاكس: +9712222222</p>
                                            <p>صندوق البريد: 5252444، أبوظبي، الإمارات العربية المتحدة</p>
                                        </div>

                                    </div>
                                </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                        <div style={{ width: '100%', maxWidth: '700px' }} >
                                            <h3>Terms and Conditions</h3>
                                            The following terms and conditions govern all use of the Wiki Education Foundation (“Wiki Ed”) website and all content, services,
                                            and products available at or through the website, including, but not limited to, dashboard.wikiedu.org, ask.wikiedu.org, playlist.wiki,
                                            and wikiedu.org (taken together, the “Sites” or the “Services”). Our Services are offered subject to your acceptance without modification
                                            of all of the terms and conditions contained herein and all other operating rules, policies (including, without limitation, Wiki Ed’s Privacy Policy)
                                            and procedures that may be published from time to time by Wiki
                                            Ed (collectively, the “Agreement”). You agree that we may automatically upgrade our Services, and these terms will apply to any upgrades.
                                            <br />  <br />
                                            1. Acceptance of this Agreement
                                            Please read this Agreement carefully before accessing or using our Services. By accessing or using any part of our Services, you agree to become
                                            bound by the terms and conditions of this Agreement. If you do not agree to all the terms and conditions of this Agreement, then you may not access or use
                                            any of our Services.
                                            If these terms and conditions are considered an offer by Wiki Ed, acceptance is expressly limited to these terms.
                                            <br />  <br />
                                            2. Eligibility
                                            In order to use our Services you need to (1) be 18 or older, or be 13 or older and have your parent or guardian’s consent to the Agreement, and (2) have
                                            the power to enter a binding contract with us and not be barred from doing so under any applicable laws. You also promise that any registration information
                                            that you submit to Wiki Ed is true, accurate,
                                            and complete, and you agree to keep it that way at all times.
                                            <br />  <br />
                                            3. Prohibited Uses.
                                            When using Wiki Ed’s Services, you agree not to:
                                            <br />
                                            Publish material or engage in activity that is illegal under applicable law, such as the U.S. Copyright Act, the Lanham (Trademark) Act, the Communications
                                            Decency Act (“CDA”) or the
                                            Digital Millennium Copyright Act (“DMCA”);
                                            Use the Services to overburden Wiki Ed’s systems, as determined by us in our sole discretion;
                                            Disclose the sensitive personal information of others without their permission;
                                            Send spam or bulk unsolicited messages;
                                            Interfere with, disrupt, or attack the Services or Wiki Ed’s network; or
                                            Distribute material that is or enables malware, spyware, adware, or other malicious code.
                                            <br /> <br />
                                            4. Responsibility of Visitors
                                            Wiki Ed has not reviewed, and cannot review, all of the Content posted to our Services, and cannot therefore be responsible for the Content,
                                            its use or effects. By operating our Services, Wiki Ed does not represent or imply that it endorses the Content posted therein, or that it believes such material
                                            to be accurate, useful, or non-harmful. You are responsible for taking precautions as necessary to protect yourself and your computer systems from viruses, worms,
                                            Trojan horses, and other harmful or destructive content. Our Services may contain Content that is offensive, indecent, or otherwise objectionable, as well as Content
                                            containing technical inaccuracies, typographical mistakes, and other errors. Our Services may also contain material that violates the privacy or publicity rights, or
                                            infringes the intellectual property and other proprietary rights, of third parties, or the downloading, copying or use of which is subject to additional terms and
                                            conditions, stated or unstated. Wiki
                                            Ed disclaims any responsibility for any harm resulting from the use by visitors of our Services, or from any downloading by those visitors of Content posted therein.
                                        </div>

                                        <div style={{ width: '100%', maxWidth: '700px' }} >
                                            <h3>الشروط والأحكام</h3>
                                            تحكم الشروط والأحكام التالية جميع استخدامات موقع Wiki Education Foundation ("Wiki Ed") وجميع المحتويات والخدمات
                                            والمنتجات المتاحة على الموقع الإلكتروني أو من خلاله، بما في ذلك، على سبيل المثال لا الحصر، Dashboard.wikiedu.org، وask.wikiedu.org، وplaylist.wiki،
                                            و wikiedu.org (يُشار إليهما معًا باسم "المواقع" أو "الخدمات"). يتم تقديم خدماتنا بناءً على موافقتك دون تعديل
                                            لجميع الشروط والأحكام الواردة هنا وجميع قواعد التشغيل والسياسات الأخرى (بما في ذلك، على سبيل المثال لا الحصر، سياسة الخصوصية الخاصة بـ Wiki Ed)
                                            والإجراءات التي قد يتم نشرها من وقت لآخر بواسطة ويكي
                                            إد (يُشار إليها إجمالاً باسم "الاتفاقية"). أنت توافق على أنه يجوز لنا ترقية خدماتنا تلقائيًا، وسيتم تطبيق هذه الشروط على أي ترقيات.
                                            <br /> <br />

                                            1. قبول هذه الاتفاقية
                                            يرجى قراءة هذه الاتفاقية بعناية قبل الوصول إلى خدماتنا أو استخدامها. من خلال الوصول إلى أي جزء من خدماتنا أو استخدامها، فإنك توافق على أن تصبح
                                            ملزمة بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على جميع شروط وأحكام هذه الاتفاقية، فلا يجوز لك الوصول إليها أو استخدامها
                                            أي من خدماتنا.
                                            إذا كانت هذه الشروط والأحكام تعتبر عرضًا من Wiki Ed، فإن القبول يقتصر صراحةً على هذه الشروط.
                                            <br /> <br />

                                            2. الأهلية لتتمكن من استخدام خدماتنا، يجب أن (1) تبلغ من العمر 18 عامًا أو أكثر، أو تبلغ من العمر 13 عامًا أو أكثر وأن تحصل على موافقة والديك أو ولي أمرك على الاتفاقية، و(2) تتمتع بصلاحية إبرام عقد ملزم معنا. وألا يُمنع من القيام بذلك بموجب أي قوانين معمول بها. كما تتعهد بأن أي معلومات تسجيل ترسلها إلى Wiki Ed هي معلومات صحيحة ودقيقة وكاملة، وتوافق على الاحتفاظ بها بهذه الطريقة في جميع
                                            الأوقات.
                                            <br /> <br />
                                            3. الاستخدامات المحظورة.
                                            عند استخدام خدمات Wiki Ed، فإنك توافق على عدم القيام بما يلي:
                                            <br />
                                            نشر مواد أو المشاركة في نشاط غير قانوني بموجب القانون المعمول به، مثل قانون حقوق الطبع والنشر الأمريكي، وقانون لانهام (العلامات التجارية)، وقانون الاتصالات
                                            قانون الآداب ("CDA") أو
                                            قانون الألفية الجديدة لحقوق طبع ونشر المواد الرقمية ("DMCA")؛
                                            استخدام الخدمات لإثقال كاهل أنظمة Wiki Ed، على النحو الذي نحدده وفقًا لتقديرنا الخاص؛
                                            الكشف عن المعلومات الشخصية الحساسة للآخرين دون إذنهم؛
                                            إرسال رسائل غير مرغوب فيها أو رسائل مجمعة غير مرغوب فيها؛
                                            التدخل في الخدمات أو شبكة Wiki Ed أو تعطيلها أو مهاجمتها؛ أو
                                            توزيع المواد التي تمثل أو تمكّن البرامج الضارة أو برامج التجسس أو برامج الإعلانات المتسللة أو غيرها من التعليمات البرمجية الضارة.
                                            <br /> <br />
                                            نشر مواد أو المشاركة في نشاط غير قانوني بموجب القانون المعمول به، مثل قانون حقوق الطبع والنشر الأمريكي، وقانون لانهام (العلامات التجارية)، وقانون الاتصالات
                                            قانون الآداب ("CDA") أو
                                            قانون الألفية الجديدة لحقوق طبع ونشر المواد الرقمية ("DMCA")؛
                                            استخدام الخدمات لإثقال كاهل أنظمة Wiki Ed، على النحو الذي نحدده وفقًا لتقديرنا الخاص؛
                                            الكشف عن المعلومات الشخصية الحساسة للآخرين دون إذنهم؛
                                            إرسال رسائل غير مرغوب فيها أو رسائل مجمعة غير مرغوب فيها؛
                                            التدخل في الخدمات أو شبكة Wiki Ed أو تعطيلها أو مهاجمتها؛ أو
                                            توزيع المواد التي تمثل أو تمكّن البرامج الضارة أو برامج التجسس أو برامج الإعلانات المتسللة أو غيرها من التعليمات البرمجية الضارة.
                                            <br /> <br />
                                            4. مسؤولية الزوار
                                            لم يقم Wiki Ed بمراجعة، ولا يمكنه مراجعة، كل المحتوى المنشور على خدماتنا، وبالتالي لا يمكن أن يكون مسؤولاً عن المحتوى،
                                            استخدامه أو آثاره. من خلال تشغيل خدماتنا، لا تقر Wiki Ed أو تشير ضمنًا إلى أنها تؤيد المحتوى المنشور فيها، أو أنها تعتقد أن هذه المواد
                                            أن تكون دقيقة أو مفيدة أو غير ضارة. أنت مسؤول عن اتخاذ الاحتياطات اللازمة لحماية نفسك وأنظمة الكمبيوتر الخاصة بك من الفيروسات والديدان
                                            أحصنة طروادة، وغيرها من المحتويات الضارة أو المدمرة. قد تحتوي خدماتنا على محتوى مسيء أو غير لائق أو غير مرغوب فيه، بالإضافة إلى المحتوى
                                            تحتوي على أخطاء فنية وأخطاء مطبعية وأخطاء أخرى. قد تحتوي خدماتنا أيضًا على مواد تنتهك حقوق الخصوصية أو الدعاية، أو
                                            ينتهك حقوق الملكية الفكرية وحقوق الملكية الأخرى لأطراف ثالثة، أو التي يخضع تنزيلها أو نسخها أو استخدامها لشروط إضافية و
                                            الشروط، معلنة أو غير معلنة. ويكي
                                            ينكر Ed أي مسؤولية عن أي ضرر ناتج عن استخدام زوار خدماتنا، أو من أي تنزيل يقوم به هؤلاء الزوار للمحتوى المنشور فيها.
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }} >
                                        <img src={logo} alt="logo" style={{ width: '100px' }} />
                                        <div>
                                            <h3 style={{ textTransform: 'uppercase' }} > Administration Fees </h3>
                                        </div>
                                    </div>
                                    <Table striped hover responsive style={{ border: '1px solid black', marginTop: '10px' }} key={contractInfo._id}>
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th style={{ color: 'white', textAlign: 'center' }} >Fees Description</th>
                                            <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                            <th style={{ color: 'white', textAlign: 'center' }}>كمية</th>
                                            <th style={{ color: 'white', textAlign: 'center' }}>وصف الرسوم </th>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                    Contract issuing fees
                                                    <p>(New-Renewal)</p>
                                                </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 210</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >درهم 210 </td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم إصدار العقود (التجديد الجديد) </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Ejari fee</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 200</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >درهم 200</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم إيجاري</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Lease agreement transfer fee   <p>(Residential and commercial)</p></td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 525</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >درهم 525</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم نقل عقد الإيجار (السكنية والتجارية) </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Early termination fees of the lease agreement <br /> (Residential and commercial)</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > Deduct two (2) months of the rental value </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >خصم شهرين (2) من القيمة الإيجارية</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم الإنهاء المبكر لعقد الإيجار (السكني والتجاري)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Non-Renewal without prior written notice <br /> 60 days prior to contract expiry <br /> (Residentail Properties) <br /> 90 days prior to contract expiry <br /> Commercial properties </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 1,050</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >درهم 1,050</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >عدم التجديد دون إشعار كتابي مسبق قبل 60<br /> يومًا من انتهاء العقد <br /> (العقارات السكنية) قبل 90 يومًا من انتهاء  <br />العقد العقارات التجارية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Termination fees of lease <br /> agreement after the date of <br />completion (residential and commercial) </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Rental Fee for the occupied period <br /> plus Two Months of the rental value </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >رسوم الإيجار للفترة المشغولة <br /> بالإضافة إلى شهرين من القيمة الإيجارية</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم إنهاء عقد الإيجار بعد تاريخ الانتهاء (السكني والتجاري)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Maintenance Security deposit</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > 5% of total rental amount. <br /> minimum of AED 3,000 </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >5% من إجمالي مبلغ الإيجار. <br /> الحد الأدنى 3000 درهم</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >وديعة تأمين الصيانة</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Refundable Guarantee Checque to <br /> acquire Permission to Vacate <br /> (To return to the tenant upon <br />submission of DEWA, chiller, and gas clearance) or to change <br /> furniture during contract period </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 5,000  ( Apartments)
                                                    <p>AED 10,000 (Villas and commercial) </p>
                                                </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                    شقق سكنية درهم(5,000)
                                                    <p> 10,000 درهم (فلل وتجارية) </p>
                                                </td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >شيك ضمان قابل للاسترداد <br /> للحصول على إذن الإخلاء <br /> (للإرجاع إلى المستأجر عند <br /> تقديم تخليص هيئة كهرباء ومياه دبي والمبرد وتخليص الغاز) أو لتغيير <br /> الأثاث خلال فترة العقد</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Late Renewal fees</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 10.5 per day effective 8 days <br />after the expiry of the lease <br />agreement </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >10.5 درهم إماراتي في اليوم اعتبارًا من 8 أيام <br />بعد انتهاء عقد الإيجار <br /></td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم التجديد المتأخر</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Returned cheque fees</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 262.5 per cheque</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >262.5 درهماً إماراتياً لكل شيك</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم الشيكات المرتجعة</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >Postpone cheque fees (maximum 1 month)</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AED 525 per cheque</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >525 درهماً إماراتياً لكل شيك</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'center' }} >رسوم تأجيل الشيك (بحد أقصى شهر واحد)</td>
                                            </tr>

                                            {/* {
            property?.map((item) => {
                console.log(item, 'itemproperty');
                return (
                    <> */}
                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Property Name</td>
                                                        <td className='text-center' >{property?.name && property?.name}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Name</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Description</td>
                                                        <td className='text-center'>{property?.description && property?.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Description</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Address</td>
                                                        <td className='text-center'>{property?.address && property?.address}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Address</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>City</td>
                                                        <td className='text-center'>{property?.city && property?.city}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >City</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                        <td className='text-center'>{property?.propertyType && property?.propertyType}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                    </tr>
                                                    : null
                                            }
                                            {/* </>
                )
            })
        } */}

                                            {/* <tr>
        <td style={{ backgroundColor: '#e7e6e6' }}>Property Image</td>
        <td className='text-center'><img src={property[0]?.propertyImage} alt="Property" style={{ width:'100px' }} /></td>
        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }}>Property Image</td>
    </tr> */}

                                        </tbody>
                                    </Table>

                                    <Table striped hover responsive bordered  >
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th style={{ color: 'white', textAlign: 'center' }} >* Above Prices are included VAT</th>
                                            <th style={{ textAlign: 'center', color: 'white' }}>* الأسعار المذكورة أعلاه شاملة ضريبة القيمة المضافة</th>
                                        </thead>
                                        <tr>
                                            <td style={{ textAlign: 'center', paddingTop: '50px', }}>
                                                Prepared By : Jovera Group (Signature)
                                            </td>
                                            <td style={{ textAlign: 'center', paddingTop: '50px' }} >
                                                Approved By : Tenant (Signature)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: 'center' }}>Dated:</td>
                                            <td style={{ textAlign: 'center' }} >Dated:</td>
                                        </tr>
                                    </Table>
                                </Col>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default StaticTenantDataforOwner