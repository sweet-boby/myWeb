import { UIdata } from "../scene/selector";

interface Props {
  uiData: UIdata | null;
}

export default function SelectorUI(props: Props) {
  const uidata = props.uiData;
  if (uidata)
    return (
      <div className=" flex h-full justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <img
            src={uidata.img_1P.src}
            className="w-auto h-auto object-contain"
          />
          <div className=" relative">
            <div className=" absolute flex flex-col justify-center text-center left-25 top-22">
              <img
                src={
                  uidata.playerType_1P === 0
                    ? uidata.animetion_peashooter_frame.src
                    : uidata.animetion_sunflower_frame.src
                }
                className="w-auto h-auto object-contain"
              />

              <div className=" font-[myFont] font-bold text-white mt-10">
                {uidata.playerType_1P === 0 ? "豌豆射手" : "向日葵"}
              </div>
            </div>
            <img
              src={uidata.img_gravestone_left.src}
              className="w-auto h-auto object-contain"
            />
          </div>

          <img
            src={uidata.img_1P_desc.src}
            className="w-auto h-auto object-contain"
          />
        </div>
        <div className="flex flex-col  justify-center items-center">
          <img
            className=" w-auto object-contain"
            src={uidata.img_VS.src}
            alt=""
          />
          <img
            className=" w-auto object-contain"
            src={uidata.img_selector_tip.src}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <img
            src={uidata.img_2P.src}
            alt=""
            className="w-auto h-auto object-contain "
          />
          <div className=" relative">
            <div className=" absolute flex flex-col justify-center text-center left-25 top-22">
              <img
                src={
                  uidata.playerType_2P === 0
                    ? uidata.animetion_peashooter_frame.src
                    : uidata.animetion_sunflower_frame.src
                }
                className="w-auto h-auto object-contain"
              />

              <div className=" font-[myFont] font-bold text-white mt-10">
                {uidata.playerType_2P === 0 ? "豌豆射手" : "向日葵"}
              </div>
            </div>
            <img
              src={uidata.img_gravestone_left.src}
              className="w-auto h-auto object-contain"
            />
          </div>
          <img
            src={uidata.img_2P_desc.src}
            alt=""
            className="w-auto h-auto object-contain"
          />
        </div>
        {/* <div className=" flex flex-wrap">
          <img src={uidata.img_avatar_peashooter.src} alt="" />
          <img src={uidata.img_avatar_sunflower.src} alt="" />
          <img src={uidata.img_1P_desc.src} alt="" />
          <img src={uidata.img_2P_desc.src} alt="" />
          <img src={uidata.img_1P.src} alt="" />
          <img src={uidata.img_2P.src} alt="" />
          <img
            src={uidata.atlas_peashooter_idle_right?.getImage(0).src}
            alt=""
          />
          <img
            src={uidata.atlas_sunflower_idle_right?.getImage(0).src}
            alt=""
          />
          <img src={uidata.img_gravestone_left.src} alt="" />
          <img src={uidata.img_selector_tip.src} alt="" />
        </div> */}
      </div>
    );
}
