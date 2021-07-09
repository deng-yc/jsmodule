import isObject from "lodash/isObject";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ThumbnailOptions = {
    /**
     * 缩放比例,0-100
     */
    scale?: number;
    scale_type?: "default" | "width" | "height";
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    area?: number;
};

class ImageMogr2Creater {
    private callbacks = [];
    use(cb: (builder: ImageMogr2) => ImageMogr2) {
        this.callbacks.push(cb);
        return this;
    }
    apply(builder) {
        let img = builder;
        for (const cb of this.callbacks) {
            img = cb(img);
        }
        return img;
    }
}

export class ImageMogr2 {
    private default_host = "";
    private hosts = [];

    private options: any = {};

    static Creater = new ImageMogr2Creater();

    constructor(private download_url) {
        this.autoOrient();
    }

    setDefaultHost(default_host) {
        this.default_host = default_host;
        return this;
    }

    setHosts(hosts = []) {
        this.hosts = hosts;
        return this;
    }

    private thumbnailScale(options: ThumbnailOptions) {
        let scaleType = options.scale_type;
        if (!scaleType) {
            scaleType = "default";
        }
        if (scaleType == "default") {
            return `!${options.scale}p`;
        } else if (scaleType == "width") {
            return `!${options.scale}px`;
        } else if (scaleType == "height") {
            return `!x${options.scale}p`;
        }
        return null;
    }

    thumbnail(options: ThumbnailOptions) {
        this.options.thumbnail = this.options.thumbnail || {};
        let expr;
        if (options.scale) {
            expr = this.thumbnailScale(options);
            this.options.thumbnail["scale"] = expr;
            return this;
        }
        //指定目标图片宽度为 Width，高度等比压缩。
        if (options.width && !options.height) {
            this.options.thumbnail["wh"] = `${options.width || ""}x`;
            return this;
        }
        //指定目标图片高度为 Height，宽度等比压缩。
        if (!options.width && options.height) {
            this.options.thumbnail["wh"] = `x${options.width || ""}`;
            return this;
        }
        //忽略原图宽高比例，指定图片宽度为 Width，高度为 Height ，强行缩放图片，可能导致目标图片变形。
        if (options.width && options.height) {
            this.options.thumbnail["wh"] = `${options.width}x${options.height}!`;
            return this;
        }

        //限定缩略图的宽度和高度的最大值分别为 Width 和 Height，进行等比缩放。
        if (options.maxWidth || options.maxHeight) {
            this.options.thumbnail["max"] = `${options.maxWidth || ""}x${options.maxHeight || ""}`;
            return this;
        }
        //限定缩略图的宽度和高度的最小值分别为 Width 和 Height，进行等比缩放。
        if (options.minWidth || options.minHeight) {
            this.options.thumbnail["min"] = `!${options.minWidth || ""}x${options.minHeight || ""}r`;
            return this;
        }
        //等比缩放图片，缩放后的图像，总像素数量不超过 Area。
        if (options.area) {
            this.options.thumbnail["area"] = `${options.area}@`;
        }
        return this;
    }

    cut(width, height, dx, dy) {
        this.options.cut = `${width}x${height}x${dx}x${dy}`;
        return this;
    }

    crop(width?, height?) {
        if (!width && !height) {
            return this;
        }
        this.options.crop = `${width || ""}x${height || ""}`;
        return this;
    }

    iradius(radius) {
        this.options.iradius = radius;
        return this;
    }

    scrop(width, height) {
        this.options.scrop = `${width}x${height}`;
        return this;
    }
    gravity(
        gravity: "northwest" | "north" | "northeast" | "west" | "center" | "east" | "southwest" | "south" | "southeast"
    ) {
        this.options.gravity = gravity;
        return this;
    }

    rotate(deg) {
        this.options.rotate = deg;
        return this;
    }

    autoOrient() {
        this.options["auto-orient"] = true;
        return this;
    }

    format(format?: "jpg" | "bmp" | "gif" | "png" | "webp" | "yjpeg") {
        if (format) {
            this.options.format = format;
        } else {
            this.options.format = null;
        }
        return this;
    }

    cgif(frameNumber: number) {
        this.options.cgif = frameNumber;
        return this;
    }

    quality(quality, force = false) {
        this.options.quality = `${quality}${force ? "!" : ""}`;
        return this;
    }
    rquality(quality) {
        this.options.rquality = quality;
        return this;
    }
    lquality(quality) {
        this.options.lquality = quality;
        return this;
    }
    blur(radius, sigma) {
        if (sigma <= 0) {
            return this;
        }
        this.options.blur = `${radius}x${sigma}`;
        return this;
    }
    sharpen(value) {
        if (value >= 10 && value <= 300) {
            this.options.sharpen = value;
        }
        return this;
    }

    getQuery(hasQuery = false) {
        const options: string[] = [];
        for (const key in this.options) {
            const val = this.options[key];
            if (val === true) {
                options.push(`/${key}`);
            } else if (isObject(val)) {
                for (const item in val) {
                    const itemVal = val[item];
                    options.push(`/${key}/${itemVal}`);
                }
            } else if (val) {
                options.push(`/${key}/${val}`);
            }
        }
        if (options.length == 0) {
            return "";
        }
        let prefix = "?";
        if (hasQuery) {
            prefix = "&";
        }
        return `${prefix}imageMogr2${options.join("")}`;
    }

    /**
     * 获取url
     */
    getURL() {
        if (!this.download_url) {
            return null;
        }
        if (/^file:\/\//.test(this.download_url)) {
            return this.download_url;
        }
        if (/\.gif$/.test(this.download_url)) {
            //强行将gif转换为16
            this.options = [];
            // this.cgif(20);
        }
        let hasQuery = false;
        if (this.download_url.indexOf("?") != -1) {
            hasQuery = true;
        }
        if (/^\/\//.test(this.download_url) || /^https?:\/\//.test(this.download_url)) {
            for (const h of this.hosts) {
                if (this.download_url.indexOf(h) != -1) {
                    return `${this.download_url}${this.getQuery(hasQuery)}`;
                }
            }
            return this.download_url;
        }
        const path = this.download_url.replace(/^\//, "");
        return `${this.default_host}/${path}${this.getQuery(hasQuery)}`;
    }

    /**
     * 获取url
     * @deprecated
     */
    render() {
        return this.getURL();
    }

    static src(url, host = null) {
        let img = new ImageMogr2(url);
        img = ImageMogr2.Creater.apply(new ImageMogr2(url));
        if (host) {
            img.setDefaultHost(host);
        }
        return img;
    }
}

export default ImageMogr2;
