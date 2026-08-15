"use client";

import React, { forwardRef, CSSProperties } from "react";
import Aurora from "@/components/Aurora";

export interface SliderItemData {
  title: string;
  num: string;
  description?: string;
  tags?: string[];
  data?: any;
}

// Reference frame the % positions below were derived from.
const REF_W = 326;
const REF_H = 503;
const pct = (px: number, ref: number) => `${(px / ref) * 100}%`;


// ─── Reusable Card component ───────────────────────────────────────────────
export interface SliderCardProps {
  item: SliderItemData;
  onClick?: () => void;
}

const SliderCard = forwardRef<HTMLDivElement, SliderCardProps>(
  ({ item, onClick }, ref) => {

    return (
      <div
        ref={ref}
        onClick={onClick}
        className="absolute top-1/2 left-1/2 cursor-pointer select-none overflow-hidden rounded-[26.8px] "
        style={
          {
            "--w": "clamp(240px, 30vw, 326px)",
            "--h": "clamp(370px, 46vw, 503px)",
            width: "var(--w)",
            height: "var(--h)",
            marginTop: "calc(var(--h) / -2)",
            marginLeft: "calc(var(--w) / -2)",
            willChange: "transform, opacity",
            contain: "layout style paint",
            transition: "none",
            display: "block",
            position: "absolute",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.51)",
          } as React.CSSProperties
        }
      >
        {/* base tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(156deg, rgba(11,14,41,0.47) 49.66%, rgba(44,64,136,0.47) 78.04%)",
          }}
        />

        <div className="absolute inset-0">
          <Aurora
            colorStops={["#902FF7", "#0A41F3", "#902FF7"]}
            blend={0.35}
            amplitude={0.8}
            speed={9}
          />
        </div>

        {/* glass sheen */}
        <div
          className="absolute inset-0"
          style={{
            background: "",
          }}
        />

        {/* number watermark */}
        <p
          className="absolute font-bold text-white opacity-[0.07]"
          style={{
            left: pct(22, REF_W),
            top: pct(68, REF_H),
            fontFamily: "var(--font-oswald, inherit)",
            fontSize: "clamp(60px, 14vw, 161px)",
            lineHeight: 1,
          }}
        >
          {item.num}
        </p>

        {/* content */}
        <div
          className="absolute flex flex-col items-start"
          style={{
            left: pct(22, REF_W),
            top: pct(311, REF_H),
            width: pct(282, REF_W),
            gap: "clamp(10px, 2vw, 19px)",
          }}
        >
          <p
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(22px, 4vw, 37px)", lineHeight: 1.13 }}
          >
            {item.title}
          </p>

          {item.description && (
            <p
              className="text-white/90"
              style={{ fontSize: "clamp(11px, 1.6vw, 14px)", lineHeight: 1.38 }}
            >
              {item.description}
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center" style={{ gap: "clamp(6px, 1vw, 11px)" }}>
              {item.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="cursor-pointer text-nowrap rounded-[84.9px] bg-white font-medium text-[#040A27]"
                  style={{
                    padding: "5px 10px",
                    fontSize: "clamp(8px, 1.1vw, 9px)",
                    lineHeight: "12.86px",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SliderCard.displayName = "SliderCard";

export default SliderCard;