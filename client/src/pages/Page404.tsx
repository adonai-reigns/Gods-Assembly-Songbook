import { Card } from 'primereact/card';

export interface propsInterface {
    className?: string;
    title?: string;
    children?: any;
}

export const propsDefaults = {
    className: '',
    title: undefined,
}

const CardTitleTemplate = () => {
    return <span className="xl:text-4xl">Parable of a Lost Sheep</span>
}

const Page404 = function (props: propsInterface) {

    const title = (props.title ?? 'Looking for a lost page?');

    return <div className={`page-404-main ${props.className}`}>

        <h2 className="text-center xl:text-4xl">{title}</h2>

        <p className="xl:text-2xl text-center">
            ... you should probably start at the <a href="/"
            >home</a> page :)
        </p>

        {(props.children ? props.children : <>

            <Card className="bible-quote" title={() => <CardTitleTemplate />}>
                <div className="grid w-full">
                    <div className="bible-quote-image text-center w-full">
                        <img
                            src="/images/vecteezy_a-boy-with-three-cute-sheep-on-white-background-illustration_1424929/1o34_b837_200914-scaled.jpg"
                            alt="Shepherd with sheep"
                            width="500"
                            height="250"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                    <div className="bible-quote-content xl:text-4xl">
                        <p><span className="font-italic">What do you think?"</span> said Jesus,</p>
                        <p>
                            <span className="font-italic">"If there's a hundred sheep that belong to someone and he finds
                                out that one of them has wandered away, won't he leave the other
                                99 on the mountains and go searching for the one that has
                                strayed?</span>
                        </p>
                        <p>
                            <span className="font-italic">"And then if he should find the lost sheep,"</span> I'm telling you,
                            <span className="font-italic">"he'll be more joyful that the sheep is safe again, than
                                the fact that the other 99 had not strayed.</span>
                        </p>
                        <p>
                            <span className="font-italic">"So, you can understand why your Father in the heavens is not
                                willing that any one of these little ones should perish".</span>
                        </p>
                        <div className="bible-quote-reference text-right">
                            Jesus Christ, Matthew 18:12-14 (paraphrased)
                        </div>
                    </div>

                </div>
            </Card>
        </>)}
    </div>
}

export default Page404;
