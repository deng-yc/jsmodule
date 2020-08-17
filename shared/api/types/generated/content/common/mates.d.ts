export declare class MatesApi {
    private http;
    /**
     * 成为Mate,获取Mate
     * @method POST 成为Mate
     * @method GET 获取Mate
     *
     */
    mates(): any;
    /**
     * 获取Mate详情
     * @method GET 获取Mate详情
     *
     * @params id MateId
     */
    matesById(id: any): any;
    /**
     * 获取当前Mate对象
     * @method GET 获取当前Mate对象
     *
     */
    me(): any;
    /**
     * 更新Mate信息
     * @method PUT 更新Mate信息
     *
     */
    info(): any;
    /**
     * 更新Mate触达状态
     * @method PUT 更新Mate触达状态
     *
     */
    reachableStatus(): any;
    /**
     * 更新Mate销售信息
     * @method PUT 更新Mate销售信息
     *
     */
    voiceProduct(): any;
    /**
     * 获取Mate评论
     * @method GET 获取Mate评论
     *
     * @params id MateId
     */
    comments(id: any): any;
    /**
     * 取消收藏Mate,收藏Mate
     * @method DELETE 取消收藏Mate
     * @method PUT 收藏Mate
     *
     * @params id MateId
     */
    collect(id: any): any;
    /**
     * 踩Mate
     * @method PUT 踩Mate
     *
     * @params id MateId
     */
    dislike(id: any): any;
    /**
     * 不关心Mate
     * @method PUT 不关心Mate
     *
     * @params id MateId
     */
    indifferent(id: any): any;
    /**
     * 点赞Mate
     * @method PUT 点赞Mate
     *
     * @params id MateId
     */
    like(id: any): any;
    /**
     * 获取Mate审核信息
     * @method GET 获取Mate审核信息
     *
     * @params id MateId
     */
    reviews(id: any): any;
    /**
     * 获取当前Soul收藏的Mate
     * @method GET 获取当前Soul收藏的Mate
     *
     */
    myCollect(): any;
    /**
     * 获取当前Soul踩的Mate
     * @method GET 获取当前Soul踩的Mate
     *
     */
    myDislike(): any;
    /**
     * 获取当前Soul点赞的Mate
     * @method GET 获取当前Soul点赞的Mate
     *
     */
    myLike(): any;
    /**
     * 获取最近Mate
     * @method GET 获取最近Mate
     *
     */
    latest(): any;
    /**
     * 获取最热Mate
     * @method GET 获取最热Mate
     *
     */
    hot(): any;
}
export default MatesApi;
//# sourceMappingURL=mates.d.ts.map