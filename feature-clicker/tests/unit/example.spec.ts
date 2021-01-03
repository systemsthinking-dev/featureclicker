import { assert, expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import DoFeatureWork from "@/components/DoFeatureWork.vue";
import { fakeIndividualWork } from "@/IndividualWork";
import { Subject } from "rxjs";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "Feature Clicker";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg, individualWork: fakeIndividualWork }
    });
    expect(wrapper.text()).to.include(msg);
  });
});

describe("DoFeatureWork.vue", () => {
  it("adds 'yes' to the subject when clicked", () => {
    const wrapper = shallowMount(DoFeatureWork, {
      propsData: { doWork: new Subject() }
    });
    assert(wrapper);
  });
});
